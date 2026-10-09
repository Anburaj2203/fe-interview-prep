import { createContext } from 'react'

import type { User } from './types'

export type AuthStatus = 'unknown' | 'signed-in' | 'signed-out'

export type AuthValue = {
  status: AuthStatus
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  request: <T>(call: (token: string) => Promise<T>) => Promise<T>
}

export const AuthContext = createContext<AuthValue | null>(null)
