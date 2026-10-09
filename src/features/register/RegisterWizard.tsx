import { useState } from 'react'

import { usePersistedState } from '../../hooks/usePersistedState'
import { AddressStep } from './AddressStep'
import { PersonalStep } from './PersonalStep'
import { PreferencesStep } from './PreferencesStep'
import { ProgressBar } from './ProgressBar'
import { ReviewStep } from './ReviewStep'
import { submitRegistration } from './submitRegistration'
import { EMPTY_REGISTRATION, STEPS, type Registration, type StepIndex, type TextField } from './types'
import { validateStep, type FieldErrors } from './validation'

import './RegisterWizard.css'

const DATA_STORAGE_KEY = 'registration'
const STEP_STORAGE_KEY = 'registration-step'

const LAST_STEP = STEPS.length - 1

export function RegisterWizard() {
  const [data, setData] = usePersistedState<Registration>(DATA_STORAGE_KEY, EMPTY_REGISTRATION)
  const [step, setStep] = usePersistedState<StepIndex>(STEP_STORAGE_KEY, 0)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [confirmation, setConfirmation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function changeField(field: TextField, value: string) {
    setData((current) => ({ ...current, [field]: value }))
  }

  function addSkill(skill: string) {
    setData((current) =>
      current.skills.includes(skill) ? current : { ...current, skills: [...current.skills, skill] },
    )
  }

  function removeSkill(skill: string) {
    setData((current) => ({ ...current, skills: current.skills.filter((kept) => kept !== skill) }))
  }

  function goToStep(next: StepIndex) {
    setErrors({})
    setStep(next)
  }

  function goNext() {
    const found = validateStep(step, data)

    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }

    goToStep(Math.min(step + 1, LAST_STEP) as StepIndex)
  }

  function goBack() {
    goToStep(Math.max(step - 1, 0) as StepIndex)
  }

  async function submit() {
    setIsSubmitting(true)
    const message = await submitRegistration(data)
    setIsSubmitting(false)
    setConfirmation(message)
  }

  if (confirmation !== '') {
    return (
      <section aria-label="Registration" className="wizard">
        <p className="wizard__confirmation" role="status">
          {confirmation}
        </p>
      </section>
    )
  }

  return (
    <section aria-label="Registration" className="wizard">
      <ProgressBar step={step} />

      {step === 0 ? <PersonalStep data={data} errors={errors} onChange={changeField} /> : null}
      {step === 1 ? <AddressStep data={data} errors={errors} onChange={changeField} /> : null}
      {step === 2 ? (
        <PreferencesStep
          data={data}
          errors={errors}
          onAddSkill={addSkill}
          onPlanChange={(plan) => changeField('plan', plan)}
          onRemoveSkill={removeSkill}
        />
      ) : null}
      {step === 3 ? <ReviewStep data={data} onEdit={goToStep} /> : null}

      <div className="wizard__actions">
        {step > 0 ? (
          <button className="wizard__button" onClick={goBack} type="button">
            Back
          </button>
        ) : null}

        {step < LAST_STEP ? (
          <button className="wizard__button wizard__button--primary" onClick={goNext} type="button">
            Next
          </button>
        ) : (
          <button
            className="wizard__button wizard__button--primary"
            disabled={isSubmitting}
            onClick={submit}
            type="button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </section>
  )
}
