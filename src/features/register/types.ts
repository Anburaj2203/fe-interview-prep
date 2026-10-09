export type Registration = {
  name: string
  email: string
  phone: string
  country: string
  city: string
  postalCode: string
  plan: string
  skills: string[]
}

export type TextField = Exclude<keyof Registration, 'skills'>

export const STEPS = ['Your details', 'Address', 'Preferences', 'Review'] as const

export type StepIndex = 0 | 1 | 2 | 3

export const COUNTRIES = ['India', 'United Kingdom', 'United States'] as const

export const PLANS = ['Free', 'Pro', 'Team'] as const

export const EMPTY_REGISTRATION: Registration = {
  name: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  postalCode: '',
  plan: '',
  skills: [],
}
