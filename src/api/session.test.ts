import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as server from '../features/auth/fakeServer'
import { authorizedRequest, endSession, startSession } from './session'

vi.mock('../features/auth/fakeServer', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../features/auth/fakeServer')>()

  return { ...actual, refresh: vi.fn(actual.refresh) }
})

const THIRTY_ONE_SECONDS = 31_000
const ELEVEN_MINUTES = 11 * 60_000

beforeEach(async () => {
  endSession()
  window.sessionStorage.clear()
  vi.mocked(server.refresh).mockClear()
  vi.useFakeTimers({ toFake: ['Date'] })
  startSession(await server.login('ada@example.com', 'password'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('authorizedRequest', () => {
  it('renews once when several requests fail at the same moment', async () => {
    vi.setSystemTime(Date.now() + THIRTY_ONE_SECONDS)

    const results = await Promise.all([
      authorizedRequest((token) => server.orders(token)),
      authorizedRequest((token) => server.orders(token)),
      authorizedRequest((token) => server.orders(token)),
    ])

    expect(server.refresh).toHaveBeenCalledTimes(1)
    expect(results.map((orders) => orders.length)).toEqual([2, 2, 2])
  })

  it('retries the failed request and succeeds when the access pass has expired', async () => {
    vi.setSystemTime(Date.now() + THIRTY_ONE_SECONDS)

    await expect(authorizedRequest((token) => server.orders(token))).resolves.toHaveLength(2)
  })

  it('clears the stored session when renewal itself fails', async () => {
    vi.setSystemTime(Date.now() + ELEVEN_MINUTES)

    await expect(authorizedRequest((token) => server.orders(token))).rejects.toThrow(
      'The session could not be renewed.',
    )
    expect(window.sessionStorage.getItem('session-refresh-token')).toBeNull()
  })
})
