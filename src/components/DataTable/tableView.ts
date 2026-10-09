import { PAGE_SIZES } from './types'
import type { PageSize, SortDirection, TableView } from './types'

export const DEFAULT_PAGE_SIZE: PageSize = 10

const FILTER_PREFIX = 'f.'

function toPageSize(value: string | null): PageSize {
  const parsed = Number(value)

  return PAGE_SIZES.find((size) => size === parsed) ?? DEFAULT_PAGE_SIZE
}

function toPage(value: string | null): number {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

function toSortDirection(value: string | null, sortKey: string | null): SortDirection | null {
  if (sortKey === null) {
    return null
  }

  return value === 'desc' ? 'desc' : 'asc'
}

export function parseTableView(search: string): TableView {
  const params = new URLSearchParams(search)
  const sortParam = params.get('sort')
  const sortKey = sortParam === null || sortParam === '' ? null : sortParam
  const filters: Record<string, string> = {}

  for (const [key, value] of params) {
    if (key.startsWith(FILTER_PREFIX) && value !== '') {
      filters[key.slice(FILTER_PREFIX.length)] = value
    }
  }

  return {
    sortKey,
    sortDirection: toSortDirection(params.get('dir'), sortKey),
    search: params.get('q') ?? '',
    filters,
    pageSize: toPageSize(params.get('size')),
    page: toPage(params.get('page')),
  }
}

export function formatTableView(view: TableView): string {
  const params = new URLSearchParams()

  if (view.sortKey !== null && view.sortDirection !== null) {
    params.set('sort', view.sortKey)
    params.set('dir', view.sortDirection)
  }

  if (view.search !== '') {
    params.set('q', view.search)
  }

  for (const key of Object.keys(view.filters).sort()) {
    const value = view.filters[key]

    if (value !== '') {
      params.set(`${FILTER_PREFIX}${key}`, value)
    }
  }

  if (view.pageSize !== DEFAULT_PAGE_SIZE) {
    params.set('size', String(view.pageSize))
  }

  if (view.page !== 1) {
    params.set('page', String(view.page))
  }

  const query = params.toString()

  return query === '' ? '' : `?${query}`
}

export function cycleSort(view: TableView, key: string): Pick<TableView, 'sortKey' | 'sortDirection'> {
  if (view.sortKey !== key) {
    return { sortKey: key, sortDirection: 'asc' }
  }

  if (view.sortDirection === 'asc') {
    return { sortKey: key, sortDirection: 'desc' }
  }

  return { sortKey: null, sortDirection: null }
}
