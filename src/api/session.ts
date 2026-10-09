import { HttpError, refresh } from '../features/auth/fakeServer'
import type { Tokens } from '../features/auth/types'

const REFRESH_TOKEN_KEY = 'session-refresh-token'

export class SessionExpiredError extends Error {
  constructor() {
    super('The session could not be renewed.')
    this.name = 'SessionExpiredError'
  }
}

let accessToken: string | null = null
let renewal: Promise<Tokens> | null = null

export function storedRefreshToken(): string | null {
  try {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    return null
  }
}

export function startSession(tokens: Tokens) {
  accessToken = tokens.accessToken

  try {
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  } catch {
    return
  }
}

export function endSession() {
  accessToken = null
  renewal = null

  try {
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch {
    return
  }
}

function renewOnce(): Promise<Tokens> {
  if (renewal === null) {
    const refreshToken = storedRefreshToken()

    if (refreshToken === null) {
      return Promise.reject(new SessionExpiredError())
    }

    renewal = refresh(refreshToken)
      .then((tokens) => {
        startSession(tokens)
        return tokens
      })
      .catch(() => {
        endSession()
        throw new SessionExpiredError()
      })
      .finally(() => {
        renewal = null
      })
  }

  return renewal
}

export async function authorizedRequest<T>(call: (token: string) => Promise<T>): Promise<T> {
  if (accessToken === null) {
    const renewed = await renewOnce()
    return call(renewed.accessToken)
  }

  try {
    return await call(accessToken)
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 401) {
      throw error
    }

    const renewed = await renewOnce()
    return call(renewed.accessToken)
  }
}
