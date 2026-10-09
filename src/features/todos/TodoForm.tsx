import { useState, type FormEvent } from 'react'

type TodoFormProps = {
  onAdd: (title: string) => void
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = title.trim()

    if (trimmedTitle === '') {
      return
    }

    onAdd(trimmedTitle)
    setTitle('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        aria-label="New todo"
        className="todo-form__input"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
        value={title}
      />
      <button className="todo-form__submit" type="submit">
        Add
      </button>
    </form>
  )
}
