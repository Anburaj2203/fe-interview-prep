import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../features/auth/useAuth'

export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'unknown') {
    return (
      <p className="auth__message" role="status">
        Checking your session...
      </p>
    )
  }

  if (status === 'signed-out') {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />
  }

  return <Outlet />
}
