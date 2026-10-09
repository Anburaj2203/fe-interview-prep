import { useState, type FormEvent } from 'react'

import type { Todo } from './types'

type TodoItemProps = {
  todo: Todo
  onToggle: (id: string) => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onRename, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(todo.title)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = draftTitle.trim()

    if (trimmedTitle === '') {
      return
    }

    onRename(todo.id, trimmedTitle)
    setIsEditing(false)
  }

  function startEditing() {
    setDraftTitle(todo.title)
    setIsEditing(true)
  }

  if (isEditing) {
    return (
      <li className="todo-item">
        <form className="todo-item__form" onSubmit={handleSubmit}>
          <input
            aria-label={`Edit ${todo.title}`}
            className="todo-item__input"
            onChange={(event) => setDraftTitle(event.target.value)}
            value={draftTitle}
          />
          <button className="todo-item__button" type="submit">
            Save
          </button>
          <button className="todo-item__button" onClick={() => setIsEditing(false)} type="button">
            Cancel
          </button>
        </form>
      </li>
    )
  }

  return (
    <li className="todo-item">
      <input
        checked={todo.completed}
        className="todo-item__toggle"
        id={`todo-${todo.id}`}
        onChange={() => onToggle(todo.id)}
        type="checkbox"
      />
      <label
        className={todo.completed ? 'todo-item__title todo-item__title--done' : 'todo-item__title'}
        htmlFor={`todo-${todo.id}`}
      >
        {todo.title}
      </label>
      <button
        aria-label={`Edit ${todo.title}`}
        className="todo-item__button"
        onClick={startEditing}
        type="button"
      >
        Edit
      </button>
      <button
        aria-label={`Delete ${todo.title}`}
        className="todo-item__button"
        onClick={() => onDelete(todo.id)}
        type="button"
      >
        Delete
      </button>
    </li>
  )
}
