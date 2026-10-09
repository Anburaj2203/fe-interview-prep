import { FILTERS, type Filter } from './types'

type TodoFooterProps = {
  activeCount: number
  completedCount: number
  filter: Filter
  onFilterChange: (filter: Filter) => void
  onClearCompleted: () => void
}

const FILTER_LABELS: Record<Filter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
}

export function TodoFooter({
  activeCount,
  completedCount,
  filter,
  onFilterChange,
  onClearCompleted,
}: TodoFooterProps) {
  return (
    <footer className="todo-footer">
      <p className="todo-footer__count" role="status">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </p>

      <div aria-label="Filter todos" className="todo-footer__filters" role="group">
        {FILTERS.map((option) => (
          <button
            aria-pressed={option === filter}
            className={
              option === filter ? 'todo-footer__filter todo-footer__filter--on' : 'todo-footer__filter'
            }
            key={option}
            onClick={() => onFilterChange(option)}
            type="button"
          >
            {FILTER_LABELS[option]}
          </button>
        ))}
      </div>

      <button
        className="todo-footer__clear"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
        type="button"
      >
        Clear completed
      </button>
    </footer>
  )
}
