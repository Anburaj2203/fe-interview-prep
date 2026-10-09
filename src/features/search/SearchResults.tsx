import { HighlightedText } from './HighlightedText'
import type { Product } from './types'

type SearchResultsProps = {
  products: Product[]
  query: string
}

export function SearchResults({ products, query }: SearchResultsProps) {
  return (
    <ul className="search__results">
      {products.map((product) => (
        <li className="search__result" key={product.id}>
          <h3 className="search__result-title">
            <HighlightedText query={query} text={product.title} />
          </h3>
          <p className="search__result-description">{product.description}</p>
        </li>
      ))}
    </ul>
  )
}
