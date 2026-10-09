import type { AdminStats, Order, Tokens, User } from './types'

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

const ACCESS_LIFETIME_MS = 30_000
const REFRESH_LIFETIME_MS = 10 * 60_000

const ACCOUNTS: Array<User & { password: string }> = [
  { id: 'u1', name: 'Ada Lovelace', email: 'ada@example.com', password: 'password', role: 'user' },
  {
    id: 'u2',
    name: 'Grace Hopper',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
  },
]

const ORDERS: Record<string, Order[]> = {
  u1: [
    { id: 'o-1', item: 'Mechanical keyboard', total: '£89.00' },
    { id: 'o-2', item: 'Desk lamp', total: '£32.50' },
  ],
  u2: [{ id: 'o-3', item: 'Standing desk', total: '£420.00' }],
}

function issue(userId: string, kind: string, lifetimeMs: number) {
  return `${kind}.${userId}.${Date.now() + lifetimeMs}`
}

function readToken(token: string, kind: string) {
  const [tokenKind, userId, expiresAt] = token.split('.')

  if (tokenKind !== kind || userId === undefined || expiresAt === undefined) {
    throw new HttpError(401, 'Token is not valid')
  }

  if (Number(expiresAt) <= Date.now()) {
    throw new HttpError(401, 'Token has expired')
  }

  return userId
}

function issueTokens(userId: string): Tokens {
  return {
    accessToken: issue(userId, 'access', ACCESS_LIFETIME_MS),
    refreshToken: issue(userId, 'refresh', REFRESH_LIFETIME_MS),
  }
}

function accountFor(userId: string): User {
  const account = ACCOUNTS.find((candidate) => candidate.id === userId)

  if (account === undefined) {
    throw new HttpError(401, 'No such account')
  }

  return { id: account.id, name: account.name, email: account.email, role: account.role }
}

export async function login(email: string, password: string): Promise<Tokens> {
  const account = ACCOUNTS.find(
    (candidate) => candidate.email === email && candidate.password === password,
  )

  if (account === undefined) {
    throw new HttpError(401, 'Those details do not match an account.')
  }

  return issueTokens(account.id)
}

export async function refresh(refreshToken: string): Promise<Tokens> {
  return issueTokens(readToken(refreshToken, 'refresh'))
}

export async function me(accessToken: string): Promise<User> {
  return accountFor(readToken(accessToken, 'access'))
}

export async function orders(accessToken: string): Promise<Order[]> {
  return ORDERS[readToken(accessToken, 'access')] ?? []
}

export async function adminStats(accessToken: string): Promise<AdminStats> {
  const user = accountFor(readToken(accessToken, 'access'))

  if (user.role !== 'admin') {
    throw new HttpError(403, 'Only admins may read the statistics.')
  }

  return { signUps: 128, activeToday: 37 }
}
