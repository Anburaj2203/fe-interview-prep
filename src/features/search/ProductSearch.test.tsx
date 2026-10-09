import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ProductSearch } from './ProductSearch'
import type { Product } from './types'

type PendingRequest = {
  promise: Promise<Response>
  respondWith: (products: Product[]) => void
  failWith: (status: number) => void
}

function createPendingRequest(): PendingRequest {
  let settle: (response: Response) => void = () => undefined
  const promise = new Promise<Response>((resolve) => {
    settle = resolve
  })

  return {
    promise,
    respondWith: (products) => settle(new Response(JSON.stringify({ products }), { status: 200 })),
    failWith: (status) => settle(new Response('', { status })),
  }
}

function queryOf(input: RequestInfo | URL) {
  return new URL(String(input)).searchParams.get('q') ?? ''
}

const pending = new Map<string, PendingRequest>()

const fetchMock = vi.fn((input: RequestInfo | URL) => {
  const request = createPendingRequest()
  pending.set(queryOf(input), request)
  return request.promise
})

function pendingFor(query: string) {
  const request = pending.get(query)

  if (request === undefined) {
    throw new Error(`No request was made for "${query}"`)
  }

  return request
}

function setup() {
  const user = userEvent.setup({ delay: null })
  render(<ProductSearch />)

  return user
}

async function typeQuery(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(screen.getByRole('searchbox', { name: 'Search products' }), text)
}

async function waitForRequestCount(count: number) {
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(count))
}

async function flush(respond: () => void) {
  await act(async () => {
    respond()
  })
}

beforeEach(() => {
  pending.clear()
  fetchMock.mockClear()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ProductSearch', () => {
  it('sends a single request for a word typed quickly, not one per keystroke', async () => {
    const user = setup()

    await typeQuery(user, 'react')
    await waitForRequestCount(1)

    expect(queryOf(fetchMock.mock.calls[0][0])).toBe('react')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('shows a loading state while the request is in flight', async () => {
    const user = setup()

    await typeQuery(user, 'react')
    await waitForRequestCount(1)

    expect(screen.getByRole('status')).toHaveTextContent('Searching for "react"...')
  })

  it('keeps the results of the latest query when an earlier response arrives late', async () => {
    const user = setup()

    await typeQuery(user, 'ab')
    await waitForRequestCount(1)

    await typeQuery(user, 'c')
    await waitForRequestCount(2)

    await flush(() =>
      pendingFor('abc').respondWith([{ id: 1, title: 'Newest match', description: 'current' }]),
    )
    await flush(() =>
      pendingFor('ab').respondWith([{ id: 2, title: 'Stale match', description: 'outdated' }]),
    )

    expect(screen.getByRole('heading', { name: 'Newest match' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Stale match' })).not.toBeInTheDocument()
  })

  it('highlights the matched text in each result', async () => {
    const user = setup()

    await typeQuery(user, 'react')
    await waitForRequestCount(1)
    await flush(() =>
      pendingFor('react').respondWith([
        { id: 1, title: 'The React handbook', description: 'A guide' },
      ]),
    )

    expect(screen.getByText('React', { selector: 'mark' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'The React handbook' })).toBeInTheDocument()
  })

  it('tells the person when nothing matched, quoting what they typed', async () => {
    const user = setup()

    await typeQuery(user, 'zzz')
    await waitForRequestCount(1)
    await flush(() => pendingFor('zzz').respondWith([]))

    expect(screen.getByRole('status')).toHaveTextContent('No results for "zzz"')
  })

  it('shows an error with a retry that runs the search again', async () => {
    const user = setup()

    await typeQuery(user, 'react')
    await waitForRequestCount(1)
    await flush(() => pendingFor('react').failWith(500))

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong while searching.')

    await user.click(screen.getByRole('button', { name: 'Retry' }))
    await waitForRequestCount(2)

    await flush(() =>
      pendingFor('react').respondWith([{ id: 1, title: 'React book', description: 'A guide' }]),
    )

    expect(screen.getByRole('heading', { name: 'React book' })).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
