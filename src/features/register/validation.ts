import type { Registration } from './types'

export type FieldErrors = Partial<Record<keyof Registration, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[+\d][\d\s-]{6,}$/
const INDIAN_POSTAL_CODE = /^\d{6}$/

export function validateStep(step: number, data: Registration): FieldErrors {
  const errors: FieldErrors = {}

  if (step === 0) {
    if (data.name.trim() === '') {
      errors.name = 'Enter your name.'
    }

    if (!EMAIL.test(data.email.trim())) {
      errors.email = 'Enter a valid email address.'
    }

    if (!PHONE.test(data.phone.trim())) {
      errors.phone = 'Enter a valid phone number.'
    }
  }

  if (step === 1) {
    if (data.country === '') {
      errors.country = 'Choose your country.'
    }

    if (data.city.trim() === '') {
      errors.city = 'Enter your city.'
    }

    if (data.postalCode.trim() === '') {
      errors.postalCode = 'Enter your postal code.'
    } else if (data.country === 'India' && !INDIAN_POSTAL_CODE.test(data.postalCode.trim())) {
      errors.postalCode = 'An Indian postal code must be six digits.'
    }
  }

  if (step === 2) {
    if (data.plan === '') {
      errors.plan = 'Choose a plan.'
    }

    if (data.skills.length === 0) {
      errors.skills = 'Add at least one skill.'
    }
  }

  return errors
}
