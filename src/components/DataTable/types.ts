export type SortDirection = 'asc' | 'desc'

export const PAGE_SIZES = [10, 25, 50] as const

export type PageSize = (typeof PAGE_SIZES)[number]

export type Column<Row> = {
  key: string
  header: string
  value: (row: Row) => string
  sortable?: boolean
  filterable?: boolean
}

export type TableView = {
  sortKey: string | null
  sortDirection: SortDirection | null
  search: string
  filters: Record<string, string>
  pageSize: PageSize
  page: number
}
