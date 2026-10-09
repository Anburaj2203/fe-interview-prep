export type Role = 'user' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  role: Role
}

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type Order = {
  id: string
  item: string
  total: string
}

export type AdminStats = {
  signUps: number
  activeToday: number
}
