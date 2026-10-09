import { useCallback, useEffect, useState } from 'react'

import { searchProducts } from './searchProducts'
import type { Product, SearchStatus } from './types'

type SearchOutcome = {
  query: string
  attempt: number
  products: Product[] | null
}

type ProductSearch = {
  status: SearchStatus
  products: Product[]
  retry: () => void
}

export function useProductSearch(query: string): ProductSearch {
  const [outcome, setOutcome] = useState<SearchOutcome | null>(null)
  const [attempt, setAttempt] = useState(0)

  const retry = useCallback(() => setAttempt((current) => current + 1), [])

  useEffect(() => {
    if (query === '') {
      return
    }

    const controller = new AbortController()
    let ignore = false

    searchProducts(query, controller.signal)
      .then((products) => {
        if (!ignore) {
          setOutcome({ query, attempt, products })
        }
      })
      .catch(() => {
        if (!ignore) {
          setOutcome({ query, attempt, products: null })
        }
      })

    return () => {
      ignore = true
      controller.abort()
      setOutcome(null)
    }
  }, [query, attempt])

  if (query === '') {
    return { status: 'idle', products: [], retry }
  }

  if (outcome === null || outcome.query !== query || outcome.attempt !== attempt) {
    return { status: 'loading', products: [], retry }
  }

  if (outcome.products === null) {
    return { status: 'error', products: [], retry }
  }

  return { status: 'ready', products: outcome.products, retry }
}
