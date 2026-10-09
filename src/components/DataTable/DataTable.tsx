import { applyTableView, distinctValues } from './applyTableView'
import { cycleSort } from './tableView'
import { PAGE_SIZES } from './types'
import type { Column, PageSize, TableView } from './types'

import './DataTable.css'

type DataTableProps<Row> = {
  rows: Row[]
  columns: Column<Row>[]
  rowKey: (row: Row) => string
  caption: string
  view: TableView
  onViewChange: (view: TableView) => void
}

const SORT_INDICATORS = { asc: '▲', desc: '▼' } as const

export function DataTable<Row>({
  rows,
  columns,
  rowKey,
  caption,
  view,
  onViewChange,
}: DataTableProps<Row>) {
  const matching = applyTableView(rows, columns, view)
  const pageCount = Math.max(1, Math.ceil(matching.length / view.pageSize))
  const page = Math.min(Math.max(view.page, 1), pageCount)
  const start = (page - 1) * view.pageSize
  const visible = matching.slice(start, start + view.pageSize)
  const filterable = columns.filter((column) => column.filterable === true)

  const resetToFirstPage = (changes: Partial<TableView>) =>
    onViewChange({ ...view, ...changes, page: 1 })

  const changeFilter = (key: string, value: string) =>
    resetToFirstPage({ filters: { ...view.filters, [key]: value } })

  return (
    <div className="data-table">
      <div className="data-table__controls">
        <label className="data-table__control">
          <span className="data-table__control-label">Search</span>
          <input
            className="data-table__input"
            type="search"
            value={view.search}
            onChange={(event) => resetToFirstPage({ search: event.target.value })}
          />
        </label>

        {filterable.map((column) => (
          <label key={column.key} className="data-table__control">
            <span className="data-table__control-label">{column.header}</span>
            <select
              className="data-table__select"
              value={view.filters[column.key] ?? ''}
              onChange={(event) => changeFilter(column.key, event.target.value)}
            >
              <option value="">All</option>
              {distinctValues(rows, column).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        ))}

        <label className="data-table__control">
          <span className="data-table__control-label">Rows per page</span>
          <select
            className="data-table__select"
            value={view.pageSize}
            onChange={(event) =>
              resetToFirstPage({ pageSize: Number(event.target.value) as PageSize })
            }
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="data-table__scroll">
        <table className="data-table__table">
          <caption className="data-table__caption">{caption}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    view.sortKey === column.key && view.sortDirection !== null
                      ? view.sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  {column.sortable === true ? (
                    <button
                      type="button"
                      className="data-table__sort"
                      onClick={() => resetToFirstPage(cycleSort(view, column.key))}
                    >
                      {column.header}
                      <span className="data-table__indicator" aria-hidden="true">
                        {view.sortKey === column.key && view.sortDirection !== null
                          ? SORT_INDICATORS[view.sortDirection]
                          : ''}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td className="data-table__empty" colSpan={columns.length}>
                  No records match the current view.
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr key={rowKey(row)}>
                  {columns.map((column) => (
                    <td key={column.key}>{column.value(row)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="data-table__pagination">
        <button
          type="button"
          className="data-table__page-button"
          disabled={page === 1}
          onClick={() => onViewChange({ ...view, page: page - 1 })}
        >
          Previous
        </button>
        <p className="data-table__page-status">
          Page {page} of {pageCount}, {matching.length} records
        </p>
        <button
          type="button"
          className="data-table__page-button"
          disabled={page === pageCount}
          onClick={() => onViewChange({ ...view, page: page + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  )
}
