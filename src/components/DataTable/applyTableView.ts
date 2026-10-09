import type { Column, TableView } from './types'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

function columnFor<Row>(columns: Column<Row>[], key: string): Column<Row> | undefined {
  return columns.find((column) => column.key === key)
}

export function distinctValues<Row>(rows: Row[], column: Column<Row>): string[] {
  return [...new Set(rows.map((row) => column.value(row)))].sort((left, right) =>
    collator.compare(left, right),
  )
}

export function applyTableView<Row>(
  rows: Row[],
  columns: Column<Row>[],
  view: TableView,
): Row[] {
  const query = view.search.trim().toLowerCase()
  const filters = Object.entries(view.filters)

  const matching = rows.filter((row) => {
    const matchesSearch =
      query === '' || columns.some((column) => column.value(row).toLowerCase().includes(query))

    const matchesFilters = filters.every(([key, value]) => {
      const column = columnFor(columns, key)

      return column === undefined || value === '' || column.value(row) === value
    })

    return matchesSearch && matchesFilters
  })

  const sortColumn = view.sortKey === null ? undefined : columnFor(columns, view.sortKey)

  if (sortColumn === undefined || view.sortDirection === null) {
    return matching
  }

  const order = view.sortDirection === 'asc' ? 1 : -1

  return [...matching].sort(
    (left, right) => order * collator.compare(sortColumn.value(left), sortColumn.value(right)),
  )
}
