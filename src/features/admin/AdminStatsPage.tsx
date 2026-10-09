import { useEffect, useState } from 'react'

import { adminStats } from '../auth/fakeServer'
import type { AdminStats } from '../auth/types'
import { useAuth } from '../auth/useAuth'

export function AdminStatsPage() {
  const { request } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)

  useEffect(() => {
    let ignore = false

    request((token) => adminStats(token))
      .then((found) => {
        if (!ignore) {
          setStats(found)
        }
      })
      .catch(() => {
        if (!ignore) {
          setStats(null)
        }
      })

    return () => {
      ignore = true
    }
  }, [request])

  if (stats === null) {
    return (
      <p className="auth__message" role="status">
        Loading the statistics...
      </p>
    )
  }

  return (
    <section aria-label="Admin statistics">
      <h2 className="auth__title">Statistics</h2>
      <p className="auth__stat">Sign-ups: {stats.signUps}</p>
      <p className="auth__stat">Active today: {stats.activeToday}</p>
    </section>
  )
}
