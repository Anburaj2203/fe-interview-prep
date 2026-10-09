import { requestJson } from '../../api/client'
import type { Product } from './types'

type ProductSearchResponse = {
  products: Product[]
}

export async function searchProducts(query: string, signal?: AbortSignal): Promise<Product[]> {
  const response = await requestJson<ProductSearchResponse>(
    `/products/search?q=${encodeURIComponent(query)}`,
    signal,
  )

  return response.products
}
