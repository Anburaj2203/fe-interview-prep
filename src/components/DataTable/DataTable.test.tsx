import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { DataTable } from './DataTable'
import { DEFAULT_PAGE_SIZE } from './tableView'
import type { Column, TableView } from './types'

type Member = {
  id: string
  name: string
  team: string
}

const MEMBERS: Member[] = [
  { id: '1', name: 'Gus', team: 'Alpha' },
  { id: '2', name: 'Ada', team: 'Alpha' },
  { id: '3', name: 'Lara', team: 'Beta' },
  { id: '4', name: 'Cara', team: 'Alpha' },
  { id: '5', name: 'Jon', team: 'Beta' },
  { id: '6', name: 'Bruno', team: 'Beta' },
  { id: '7', name: 'Iris', team: 'Alpha' },
  { id: '8', name: 'Elin', team: 'Alpha' },
  { id: '9', name: 'Kim', team: 'Alpha' },
  { id: '10', name: 'Dev', team: 'Beta' },
  { id: '11', name: 'Hana', team: 'Beta' },
  { id: '12', name: 'Fay', team: 'Beta' },
]

const COLUMNS: Column<Member>[] = [
  { key: 'name', header: 'Name', value: (member) => member.name, sortable: true },
  { key: 'team', header: 'Team', value: (member) => member.team, filterable: true },
]

const INITIAL_VIEW: TableView = {
  sortKey: null,
  sortDirection: null,
  search: '',
  filters: {},
  pageSize: DEFAULT_PAGE_SIZE,
  page: 1,
}

function Harness() {
  const [view, setView] = useState<TableView>(INITIAL_VIEW)

  return (
    <DataTable
      rows={MEMBERS}
      columns={COLUMNS}
      rowKey={(member) => member.id}
      caption="Team members"
      view={view}
      onViewChange={setView}
    />
  )
}

function names() {
  const [, body] = screen.getAllByRole('rowgroup')

  return within(body)
    .getAllByRole('row')
    .map((row) => within(row).getAllByRole('cell')[0].textContent)
}

function setup() {
  const user = userEvent.setup()
  render(<Harness />)

  return user
}

describe('DataTable', () => {
  it('cycles a column through ascending, descending and unsorted', async () => {
    const user = setup()
    const header = screen.getByRole('button', { name: 'Name' })

    expect(names()[0]).toBe('Gus')

    await user.click(header)
    expect(names()[0]).toBe('Ada')
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    )

    await user.click(header)
    expect(names()[0]).toBe('Lara')
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'descending',
    )

    await user.click(header)
    expect(names()[0]).toBe('Gus')
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'none')
  })

  it('narrows the rows to those matching the global search', async () => {
    const user = setup()

    await user.type(screen.getByLabelText('Search'), 'ar')

    expect(names()).toEqual(['Lara', 'Cara'])
  })

  it('applies a column filter alongside the global search', async () => {
    const user = setup()

    await user.selectOptions(screen.getByLabelText('Team'), 'Beta')
    expect(names()).toEqual(['Lara', 'Jon', 'Bruno', 'Dev', 'Hana', 'Fay'])

    await user.type(screen.getByLabelText('Search'), 'on')
    expect(names()).toEqual(['Jon'])
  })

  it('pages the rows and changes the page size', async () => {
    const user = setup()

    expect(names()).toHaveLength(DEFAULT_PAGE_SIZE)

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(names()).toEqual(['Hana', 'Fay'])
    expect(screen.getByText('Page 2 of 2, 12 records')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Rows per page'), '25')
    expect(names()).toHaveLength(12)
    expect(screen.getByText('Page 1 of 1, 12 records')).toBeInTheDocument()
  })

  it('returns to the first page when a filter changes', async () => {
    const user = setup()

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Page 2 of 2, 12 records')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Team'), 'Beta')
    expect(screen.getByText('Page 1 of 1, 6 records')).toBeInTheDocument()
  })
})
