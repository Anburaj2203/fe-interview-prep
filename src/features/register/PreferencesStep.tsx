import { useState, type FormEvent } from 'react'

import { FormField } from './FormField'
import { PLANS, type Registration } from './types'
import type { FieldErrors } from './validation'

type PreferencesStepProps = {
  data: Registration
  errors: FieldErrors
  onPlanChange: (plan: string) => void
  onAddSkill: (skill: string) => void
  onRemoveSkill: (skill: string) => void
}

export function PreferencesStep({
  data,
  errors,
  onPlanChange,
  onAddSkill,
  onRemoveSkill,
}: PreferencesStepProps) {
  const [skill, setSkill] = useState('')

  function handleAddSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedSkill = skill.trim()

    if (trimmedSkill === '') {
      return
    }

    onAddSkill(trimmedSkill)
    setSkill('')
  }

  return (
    <fieldset className="wizard__fieldset">
      <legend className="wizard__legend">Preferences</legend>

      <FormField error={errors.plan} id="plan" label="Plan">
        {(describedBy) => (
          <select
            aria-describedby={describedBy}
            className="wizard__input"
            id="plan"
            onChange={(event) => onPlanChange(event.target.value)}
            value={data.plan}
          >
            <option value="">Choose a plan</option>
            {PLANS.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <form className="wizard__skill-form" onSubmit={handleAddSkill}>
        <FormField error={errors.skills} id="skill" label="Add a skill">
          {(describedBy) => (
            <input
              aria-describedby={describedBy}
              className="wizard__input"
              id="skill"
              onChange={(event) => setSkill(event.target.value)}
              value={skill}
            />
          )}
        </FormField>

        <button className="wizard__button" type="submit">
          Add skill
        </button>
      </form>

      <ul className="wizard__skills">
        {data.skills.map((added) => (
          <li className="wizard__skill" key={added}>
            {added}
            <button
              aria-label={`Remove ${added}`}
              className="wizard__button"
              onClick={() => onRemoveSkill(added)}
              type="button"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}
