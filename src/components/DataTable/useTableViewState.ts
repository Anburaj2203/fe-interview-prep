import { useCallback, useEffect, useState } from 'react'

import { formatTableView, parseTableView } from './tableView'
import type { TableView } from './types'

type TableViewState = [TableView, (view: TableView) => void]

export function useTableViewState(): TableViewState {
  const [view, setView] = useState<TableView>(() => parseTableView(window.location.search))

  useEffect(() => {
    const restore = () => setView(parseTableView(window.location.search))

    window.addEventListener('popstate', restore)

    return () => window.removeEventListener('popstate', restore)
  }, [])

  const changeView = useCallback((next: TableView) => {
    window.history.pushState(null, '', `${window.location.pathname}${formatTableView(next)}`)
    setView(next)
  }, [])

  return [view, changeView]
}
