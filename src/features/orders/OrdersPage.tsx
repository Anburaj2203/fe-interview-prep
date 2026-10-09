import { useEffect, useState } from 'react'

import { orders } from '../auth/fakeServer'
import type { Order } from '../auth/types'
import { useAuth } from '../auth/useAuth'

export function OrdersPage() {
  const { request } = useAuth()
  const [list, setList] = useState<Order[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let ignore = false

    request((token) => orders(token))
      .then((found) => {
        if (!ignore) {
          setList(found)
        }
      })
      .catch(() => {
        if (!ignore) {
          setFailed(true)
        }
      })

    return () => {
      ignore = true
    }
  }, [request])

  if (failed) {
    return (
      <p className="auth__message" role="alert">
        Your orders could not be loaded.
      </p>
    )
  }

  if (list === null) {
    return (
      <p className="auth__message" role="status">
        Loading your orders...
      </p>
    )
  }

  return (
    <section aria-label="Your orders">
      <h2 className="auth__title">Your orders</h2>
      <ul className="auth__list">
        {list.map((order) => (
          <li className="auth__list-item" key={order.id}>
            {order.item} — {order.total}
          </li>
        ))}
      </ul>
    </section>
  )
}
