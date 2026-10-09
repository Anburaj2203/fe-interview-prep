export type Product = {
  id: number
  title: string
  description: string
}

export type SearchStatus = 'idle' | 'loading' | 'error' | 'ready'
