export type Person = {
  id: string
  name: string
  email: string
  city: string
  country: string
}

export type DirectoryStatus = 'loading' | 'error' | 'ready'
