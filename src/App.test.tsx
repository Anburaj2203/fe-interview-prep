import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import App from './App'

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ results: [] }), { status: 200 })),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('renders the app heading', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'FE Interview Prep' })).toBeInTheDocument()
  })
})
