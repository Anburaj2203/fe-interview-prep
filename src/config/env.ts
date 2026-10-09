const DEFAULT_API_BASE_URL = 'https://dummyjson.com'
const DEFAULT_DIRECTORY_API_BASE_URL = 'https://randomuser.me/api'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL

export const DIRECTORY_API_BASE_URL =
  import.meta.env.VITE_DIRECTORY_API_BASE_URL ?? DEFAULT_DIRECTORY_API_BASE_URL
