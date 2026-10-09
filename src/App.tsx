import { Link, Navigate, Route, Routes } from 'react-router-dom'

import { AdminStatsPage } from './features/admin/AdminStatsPage'
import { AuthProvider } from './features/auth/AuthProvider'
import { LoginPage } from './features/auth/LoginPage'
import { useAuth } from './features/auth/useAuth'
import { OrdersPage } from './features/orders/OrdersPage'
import { AdminRoute } from './routes/AdminRoute'
import { ProtectedRoute } from './routes/ProtectedRoute'

import './App.css'
import './features/auth/auth.css'

function Navigation() {
  const { status, user, signOut } = useAuth()

  if (status !== 'signed-in') {
    return null
  }

  return (
    <nav className="auth__nav">
      <Link className="auth__link" to="/orders">
        Orders
      </Link>
      <Link className="auth__link" to="/admin">
        Admin
      </Link>
      <span className="auth__who">{user?.name}</span>
      <button className="auth__button" onClick={signOut} type="button">
        Log out
      </button>
    </nav>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <main className="app">
        <h1 className="app__title">FE Interview Prep</h1>
        <Navigation />

        <Routes>
          <Route element={<Navigate replace to="/orders" />} path="/" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<ProtectedRoute />}>
            <Route element={<OrdersPage />} path="/orders" />
            <Route element={<AdminRoute />}>
              <Route element={<AdminStatsPage />} path="/admin" />
            </Route>
          </Route>
        </Routes>
      </main>
    </AuthProvider>
  )
}
