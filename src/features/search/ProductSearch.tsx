import { useState } from 'react'

import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { SearchResults } from './SearchResults'
import { useProductSearch } from './useProductSearch'

import './ProductSearch.css'

const DEBOUNCE_MS = 400

export function ProductSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query.trim(), DEBOUNCE_MS)
  const { status, products, retry } = useProductSearch(debouncedQuery)

  return (
    <section aria-label="Product search" className="search">
      <input
        aria-label="Search products"
        className="search__input"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
        type="search"
        value={query}
      />

      {status === 'loading' ? (
        <p className="search__message" role="status">
          Searching for "{debouncedQuery}"...
        </p>
      ) : null}

      {status === 'error' ? (
        <div className="search__message" role="alert">
          <p className="search__error">Something went wrong while searching.</p>
          <button className="search__retry" onClick={retry} type="button">
            Retry
          </button>
        </div>
      ) : null}

      {status === 'ready' && products.length === 0 ? (
        <p className="search__message" role="status">
          No results for "{debouncedQuery}"
        </p>
      ) : null}

      {status === 'ready' && products.length > 0 ? (
        <SearchResults products={products} query={debouncedQuery} />
      ) : null}
    </section>
  )
}
