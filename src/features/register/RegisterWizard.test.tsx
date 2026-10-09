import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { RegisterWizard } from './RegisterWizard'

type User = ReturnType<typeof userEvent.setup>

async function fillPersonal(user: User) {
  await user.type(screen.getByLabelText('Full name'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('Email'), 'ada@example.com')
  await user.type(screen.getByLabelText('Phone'), '+44 7700 900123')
}

async function fillAddress(user: User, country: string, postalCode: string) {
  await user.selectOptions(screen.getByLabelText('Country'), country)
  await user.type(screen.getByLabelText('City'), 'Chennai')
  await user.type(screen.getByLabelText('Postal code'), postalCode)
}

async function fillPreferences(user: User, skill: string) {
  await user.selectOptions(screen.getByLabelText('Plan'), 'Pro')
  await user.type(screen.getByLabelText('Add a skill'), skill)
  await user.click(screen.getByRole('button', { name: 'Add skill' }))
}

async function next(user: User) {
  await user.click(screen.getByRole('button', { name: 'Next' }))
}

beforeEach(() => {
  window.sessionStorage.clear()
})

describe('RegisterWizard', () => {
  it('blocks an invalid step and shows the reason beside the field at fault', async () => {
    const user = userEvent.setup()
    render(<RegisterWizard />)

    await user.type(screen.getByLabelText('Full name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await next(user)

    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'Enter a valid email address.',
    )
    expect(screen.getByRole('status')).toHaveTextContent('Step 1 of 4')
  })

  it('shows every earlier answer unchanged when going back', async () => {
    const user = userEvent.setup()
    render(<RegisterWizard />)

    await fillPersonal(user)
    await next(user)
    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(screen.getByLabelText('Full name')).toHaveValue('Ada Lovelace')
    expect(screen.getByLabelText('Email')).toHaveValue('ada@example.com')
    expect(screen.getByLabelText('Phone')).toHaveValue('+44 7700 900123')
  })

  it('requires six digits for an Indian postal code but accepts others elsewhere', async () => {
    const user = userEvent.setup()
    render(<RegisterWizard />)

    await fillPersonal(user)
    await next(user)
    await fillAddress(user, 'India', '12345')
    await next(user)

    expect(screen.getByLabelText('Postal code')).toHaveAccessibleDescription(
      'An Indian postal code must be six digits.',
    )

    await user.selectOptions(screen.getByLabelText('Country'), 'United Kingdom')
    await next(user)

    expect(screen.getByRole('status')).toHaveTextContent('Step 3 of 4')
  })

  it('will not leave the preferences step until a skill is added', async () => {
    const user = userEvent.setup()
    render(<RegisterWizard />)

    await fillPersonal(user)
    await next(user)
    await fillAddress(user, 'India', '600001')
    await next(user)
    await user.selectOptions(screen.getByLabelText('Plan'), 'Pro')
    await next(user)

    expect(screen.getByLabelText('Add a skill')).toHaveAccessibleDescription(
      'Add at least one skill.',
    )

    await user.type(screen.getByLabelText('Add a skill'), 'React')
    await user.click(screen.getByRole('button', { name: 'Add skill' }))
    await next(user)

    expect(screen.getByRole('status')).toHaveTextContent('Step 4 of 4')
  })

  it('reviews every answer and jumps back to edit one', async () => {
    const user = userEvent.setup()
    render(<RegisterWizard />)

    await fillPersonal(user)
    await next(user)
    await fillAddress(user, 'India', '600001')
    await next(user)
    await fillPreferences(user, 'React')
    await next(user)

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
    expect(screen.getByText('600001')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit Address' }))

    expect(screen.getByLabelText('City')).toHaveValue('Chennai')
  })

  it('submits from the review step and confirms', async () => {
    const user = userEvent.setup()
    render(<RegisterWizard />)

    await fillPersonal(user)
    await next(user)
    await fillAddress(user, 'India', '600001')
    await next(user)
    await fillPreferences(user, 'React')
    await next(user)
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(
      await screen.findByText('Thanks Ada Lovelace, your registration is complete.'),
    ).toBeInTheDocument()
  })

  it('brings the person back to the same step with their answers after a refresh', async () => {
    const user = userEvent.setup()
    const first = render(<RegisterWizard />)

    await fillPersonal(user)
    await next(user)
    await fillAddress(user, 'India', '600001')

    first.unmount()
    render(<RegisterWizard />)

    expect(screen.getByRole('status')).toHaveTextContent('Step 2 of 4')
    expect(screen.getByLabelText('City')).toHaveValue('Chennai')
    expect(screen.getByLabelText('Postal code')).toHaveValue('600001')
  })
  it('starts a clean form after a successful registration, keeping nothing behind', async () => {
    const user = userEvent.setup()
    const first = render(<RegisterWizard />)

    await fillPersonal(user)
    await next(user)
    await fillAddress(user, 'India', '600001')
    await next(user)
    await fillPreferences(user, 'React')
    await next(user)
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    await screen.findByText('Thanks Ada Lovelace, your registration is complete.')

    expect(window.localStorage.getItem('registration')).toBeNull()

    first.unmount()
    render(<RegisterWizard />)

    expect(screen.getByRole('status')).toHaveTextContent('Step 1 of 4')
    expect(screen.getByLabelText('Full name')).toHaveValue('')
  })

  it('starts at the first step when the stored step is not one of the real steps', () => {
    window.sessionStorage.setItem('registration-step', '7')
    render(<RegisterWizard />)

    expect(screen.getByRole('status')).toHaveTextContent('Step 1 of 4')
    expect(screen.getByLabelText('Full name')).toBeInTheDocument()
  })
})
