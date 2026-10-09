import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

import {
  SessionExpiredError,
  authorizedRequest,
  endSession,
  startSession,
  storedRefreshToken,
} from '../../api/session'
import { AuthContext, type AuthStatus, type AuthValue } from './authContext'
import { login, me } from './fakeServer'
import type { User } from './types'

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [status, setStatus] = useState<AuthStatus>(() =>
    storedRefreshToken() === null ? 'signed-out' : 'unknown',
  )
  const [user, setUser] = useState<User | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (storedRefreshToken() === null) {
      return
    }

    let ignore = false

    authorizedRequest((token) => me(token))
      .then((found) => {
        if (!ignore) {
          setUser(found)
          setStatus('signed-in')
        }
      })
      .catch(() => {
        if (!ignore) {
          endSession()
          setUser(null)
          setStatus('signed-out')
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  const signOut = useCallback(() => {
    endSession()
    setUser(null)
    setStatus('signed-out')
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const tokens = await login(email, password)
    startSession(tokens)
    const found = await me(tokens.accessToken)

    if (!isMounted.current) {
      return
    }

    setUser(found)
    setStatus('signed-in')
  }, [])

  const request = useCallback(
    async <T,>(call: (token: string) => Promise<T>) => {
      try {
        return await authorizedRequest(call)
      } catch (error) {
        if (error instanceof SessionExpiredError && isMounted.current) {
          signOut()
        }

        throw error
      }
    },
    [signOut],
  )

  const value = useMemo<AuthValue>(
    () => ({ status, user, signIn, signOut, request }),
    [status, user, signIn, signOut, request],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
