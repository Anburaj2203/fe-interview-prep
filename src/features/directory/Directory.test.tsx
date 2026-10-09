import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Directory } from './Directory'

const PEOPLE: [string, string, string][] = [
  ['Gus', 'Oyelaran', 'France'],
  ['Ada', 'Lovelace', 'Spain'],
  ['Lara', 'Pike', 'France'],
  ['Cara', 'Nunez', 'Spain'],
  ['Jon', 'Silva', 'France'],
  ['Bruno', 'Diaz', 'Spain'],
  ['Iris', 'Moreau', 'France'],
  ['Elin', 'Berg', 'Spain'],
  ['Kim', 'Olsen', 'France'],
  ['Dev', 'Rao', 'Spain'],
  ['Hana', 'Toth', 'France'],
  ['Fay', 'Lund', 'Spain'],
]

const results = PEOPLE.map(([first, last, country], index) => ({
  name: { first, last },
  email: `${first.toLowerCase()}.${last.toLowerCase()}@test.dev`,
  location: { city: 'Berlin', country },
  login: { uuid: `person-${index}` },
}))

const fetchMock = vi.fn(async () => new Response(JSON.stringify({ results }), { status: 200 }))

function names() {
  const [, body] = screen.getAllByRole('rowgroup')

  return within(body)
    .getAllByRole('row')
    .map((row) => within(row).getAllByRole('cell')[0].textContent)
}

async function renderAt(url: string) {
  window.history.replaceState(null, '', url)
  render(<Directory />)
  await screen.findByRole('table')
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
  fetchMock.mockClear()
})

describe('Directory', () => {
  it('restores the sort, search, filter and page size from the address bar', async () => {
    await renderAt('/?sort=name&dir=desc&q=o&f.country=France&size=25')

    expect(names()).toEqual([
      'Kim Olsen',
      'Jon Silva',
      'Iris Moreau',
      'Hana Toth',
      'Gus Oyelaran',
    ])
    expect(screen.getByLabelText('Search')).toHaveValue('o')
    expect(screen.getByLabelText('Country')).toHaveValue('France')
    expect(screen.getByLabelText('Rows per page')).toHaveValue('25')
  })

  it('restores the page from the address bar', async () => {
    await renderAt('/?page=2')

    expect(names()).toEqual(['Hana Toth', 'Fay Lund'])
    expect(screen.getByText('Page 2 of 2, 12 records')).toBeInTheDocument()
  })

  it('steps back through sort changes with the browser back button', async () => {
    const user = userEvent.setup()
    await renderAt('/')

    await user.click(screen.getByRole('button', { name: 'Name' }))
    expect(window.location.search).toBe('?sort=name&dir=asc')
    expect(names()[0]).toBe('Ada Lovelace')

    await user.click(screen.getByRole('button', { name: 'Name' }))
    expect(window.location.search).toBe('?sort=name&dir=desc')
    expect(names()[0]).toBe('Lara Pike')

    window.history.back()

    await waitFor(() => expect(window.location.search).toBe('?sort=name&dir=asc'))
    await waitFor(() => expect(names()[0]).toBe('Ada Lovelace'))
  })
})
