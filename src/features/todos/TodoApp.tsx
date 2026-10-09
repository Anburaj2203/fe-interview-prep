import { usePersistedState } from '../../hooks/usePersistedState'
import { TodoFooter } from './TodoFooter'
import { TodoForm } from './TodoForm'
import { TodoList } from './TodoList'
import type { Filter, Todo } from './types'

import './TodoApp.css'

const TODOS_STORAGE_KEY = 'todos'
const FILTER_STORAGE_KEY = 'todos-filter'

function matchesFilter(todo: Todo, filter: Filter) {
  if (filter === 'active') {
    return !todo.completed
  }

  if (filter === 'completed') {
    return todo.completed
  }

  return true
}

export function TodoApp() {
  const [todos, setTodos] = usePersistedState<Todo[]>(TODOS_STORAGE_KEY, [])
  const [filter, setFilter] = usePersistedState<Filter>(FILTER_STORAGE_KEY, 'all')

  const visibleTodos = todos.filter((todo) => matchesFilter(todo, filter))
  const activeCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - activeCount

  function addTodo(title: string) {
    setTodos((current) => [...current, { id: crypto.randomUUID(), title, completed: false }])
  }

  function toggleTodo(id: string) {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    )
  }

  function renameTodo(id: string, title: string) {
    setTodos((current) => current.map((todo) => (todo.id === id ? { ...todo, title } : todo)))
  }

  function deleteTodo(id: string) {
    setTodos((current) => current.filter((todo) => todo.id !== id))
  }

  function clearCompleted() {
    setTodos((current) => current.filter((todo) => !todo.completed))
  }

  return (
    <section aria-label="Todos" className="todo-app">
      <TodoForm onAdd={addTodo} />
      <TodoList
        onDelete={deleteTodo}
        onRename={renameTodo}
        onToggle={toggleTodo}
        todos={visibleTodos}
      />
      <TodoFooter
        activeCount={activeCount}
        completedCount={completedCount}
        filter={filter}
        onClearCompleted={clearCompleted}
        onFilterChange={setFilter}
      />
    </section>
  )
}
