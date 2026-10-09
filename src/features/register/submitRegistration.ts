import type { Registration } from './types'

export function submitRegistration(registration: Registration): Promise<string> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(`Thanks ${registration.name}, your registration is complete.`), 300)
  })
}
