import { TodoItem } from './TodoItem'
import type { Todo } from './types'

type TodoListProps = {
  todos: Todo[]
  onToggle: (id: string) => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, onToggle, onRename, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="todo-list__empty">Nothing to show here.</p>
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          onDelete={onDelete}
          onRename={onRename}
          onToggle={onToggle}
          todo={todo}
        />
      ))}
    </ul>
  )
}
