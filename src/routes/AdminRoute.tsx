import { Outlet } from 'react-router-dom'

import { useAuth } from '../features/auth/useAuth'

export function AdminRoute() {
  const { user } = useAuth()

  if (user?.role !== 'admin') {
    return (
      <p className="auth__message" role="alert">
        This page is for admins only. Your account does not have admin access.
      </p>
    )
  }

  return <Outlet />
}
