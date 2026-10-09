import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import { endSession } from '../../api/session'
import App from '../../App'

type User = ReturnType<typeof userEvent.setup>

const REFRESH_TOKEN_KEY = 'session-refresh-token'
const EXPIRED_REFRESH_TOKEN = 'refresh.u1.1'

function reloadKeeping(refreshToken: string | null) {
  endSession()

  if (refreshToken !== null) {
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

async function logIn(user: User, email: string) {
  await user.type(await screen.findByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Password'), 'password')
  await user.click(screen.getByRole('button', { name: 'Log in' }))
}

beforeEach(() => {
  endSession()
  window.sessionStorage.clear()
})

describe('the sign-in flow', () => {
  it('sends a logged-out person to login and then on to the page they asked for', async () => {
    const user = userEvent.setup()
    renderAt('/admin')

    await logIn(user, 'admin@example.com')

    expect(await screen.findByRole('heading', { name: 'Statistics' })).toBeInTheDocument()
  })

  it('says so plainly when the details do not match an account', async () => {
    const user = userEvent.setup()
    renderAt('/orders')

    await logIn(user, 'nobody@example.com')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Those details do not match an account.',
    )
  })

  it('keeps a signed-in non-admin out of the admin page without sending them to login', async () => {
    const user = userEvent.setup()
    renderAt('/admin')

    await logIn(user, 'ada@example.com')

    expect(await screen.findByRole('alert')).toHaveTextContent('This page is for admins only')
    expect(screen.queryByRole('heading', { name: 'Log in' })).not.toBeInTheDocument()
  })

  it('logs the person out and clears the session when renewal fails', async () => {
    const user = userEvent.setup()
    const signedIn = renderAt('/orders')

    await logIn(user, 'ada@example.com')
    await screen.findByRole('heading', { name: 'Your orders' })

    signedIn.unmount()
    reloadKeeping(EXPIRED_REFRESH_TOKEN)

    renderAt('/orders')

    expect(await screen.findByRole('heading', { name: 'Log in' })).toBeInTheDocument()
    expect(window.sessionStorage.getItem('session-refresh-token')).toBeNull()
  })

  it('restores the session on reload without the login page appearing', async () => {
    const user = userEvent.setup()
    const first = renderAt('/orders')

    await logIn(user, 'ada@example.com')
    await screen.findByRole('heading', { name: 'Your orders' })

    const survivingToken = window.sessionStorage.getItem(REFRESH_TOKEN_KEY)
    first.unmount()
    reloadKeeping(survivingToken)

    renderAt('/orders')

    expect(screen.queryByRole('heading', { name: 'Log in' })).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Checking your session...')
    expect(await screen.findByRole('heading', { name: 'Your orders' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Log in' })).not.toBeInTheDocument()
  })
})
