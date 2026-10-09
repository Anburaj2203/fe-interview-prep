import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { TodoApp } from './TodoApp'

async function addTodo(user: ReturnType<typeof userEvent.setup>, title: string) {
  await user.type(screen.getByRole('textbox', { name: 'New todo' }), title)
  await user.click(screen.getByRole('button', { name: 'Add' }))
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('TodoApp', () => {
  it('adds a todo and shows it in the list', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await addTodo(user, 'Buy milk')

    expect(screen.getByRole('checkbox', { name: 'Buy milk' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('1 item left')
  })

  it('ignores a title that is empty or only whitespace', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.click(screen.getByRole('button', { name: 'Add' }))
    await addTodo(user, '   ')

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('0 items left')
  })

  it('edits the title of an existing todo', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await addTodo(user, 'Buy milk')

    await user.click(screen.getByRole('button', { name: 'Edit Buy milk' }))
    await user.clear(screen.getByRole('textbox', { name: 'Edit Buy milk' }))
    await user.type(screen.getByRole('textbox', { name: 'Edit Buy milk' }), 'Buy oat milk')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByRole('checkbox', { name: 'Buy oat milk' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Buy milk' })).not.toBeInTheDocument()
  })

  it('keeps the original title when an edit is only whitespace', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await addTodo(user, 'Buy milk')

    await user.click(screen.getByRole('button', { name: 'Edit Buy milk' }))
    await user.clear(screen.getByRole('textbox', { name: 'Edit Buy milk' }))
    await user.type(screen.getByRole('textbox', { name: 'Edit Buy milk' }), '  ')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.getByRole('checkbox', { name: 'Buy milk' })).toBeInTheDocument()
  })

  it('deletes a todo', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await addTodo(user, 'Buy milk')

    await user.click(screen.getByRole('button', { name: 'Delete Buy milk' }))

    expect(screen.queryByRole('checkbox', { name: 'Buy milk' })).not.toBeInTheDocument()
  })

  it('completes a todo and updates the items-left count', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await addTodo(user, 'Buy milk')
    await addTodo(user, 'Walk the dog')

    await user.click(screen.getByRole('checkbox', { name: 'Buy milk' }))

    expect(screen.getByRole('checkbox', { name: 'Buy milk' })).toBeChecked()
    expect(screen.getByRole('status')).toHaveTextContent('1 item left')
  })

  it('filters by active and by completed', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await addTodo(user, 'Buy milk')
    await addTodo(user, 'Walk the dog')
    await user.click(screen.getByRole('checkbox', { name: 'Buy milk' }))

    await user.click(screen.getByRole('button', { name: 'Active' }))

    expect(screen.getByRole('checkbox', { name: 'Walk the dog' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Buy milk' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Completed' }))

    expect(screen.getByRole('checkbox', { name: 'Buy milk' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Walk the dog' })).not.toBeInTheDocument()
  })

  it('clears completed todos and leaves the active ones', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)
    await addTodo(user, 'Buy milk')
    await addTodo(user, 'Walk the dog')
    await user.click(screen.getByRole('checkbox', { name: 'Buy milk' }))

    await user.click(screen.getByRole('button', { name: 'Clear completed' }))

    expect(screen.queryByRole('checkbox', { name: 'Buy milk' })).not.toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Walk the dog' })).toBeInTheDocument()
  })

  it('keeps the todos and the selected filter across a page refresh', async () => {
    const user = userEvent.setup()
    const first = render(<TodoApp />)
    await addTodo(user, 'Buy milk')
    await addTodo(user, 'Walk the dog')
    await user.click(screen.getByRole('checkbox', { name: 'Buy milk' }))
    await user.click(screen.getByRole('button', { name: 'Active' }))

    first.unmount()
    render(<TodoApp />)

    expect(screen.getByRole('button', { name: 'Active' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('checkbox', { name: 'Walk the dog' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Buy milk' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'All' }))

    expect(screen.getByRole('checkbox', { name: 'Buy milk' })).toBeChecked()
  })
})
