import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from './useAuth'

type LocationState = {
  from?: string
}

export function LoginPage() {
  const { status, signIn } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [problem, setProblem] = useState('')

  const intended = (location.state as LocationState | null)?.from ?? '/orders'

  if (status === 'signed-in') {
    return <Navigate replace to={intended} />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProblem('')

    try {
      await signIn(email, password)
      await navigate(intended, { replace: true })
    } catch {
      setProblem('Those details do not match an account.')
    }
  }

  return (
    <form className="auth__form" onSubmit={handleSubmit}>
      <h2 className="auth__title">Log in</h2>

      <p className="auth__field">
        <label className="auth__label" htmlFor="email">
          Email
        </label>
        <input
          className="auth__input"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />
      </p>

      <p className="auth__field">
        <label className="auth__label" htmlFor="password">
          Password
        </label>
        <input
          className="auth__input"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </p>

      {problem === '' ? null : (
        <p className="auth__error" role="alert">
          {problem}
        </p>
      )}

      <button className="auth__button" type="submit">
        Log in
      </button>
    </form>
  )
}
