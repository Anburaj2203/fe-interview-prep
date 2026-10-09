import { FormField } from './FormField'
import type { FieldErrors } from './validation'
import type { Registration, TextField } from './types'

type PersonalStepProps = {
  data: Registration
  errors: FieldErrors
  onChange: (field: TextField, value: string) => void
}

export function PersonalStep({ data, errors, onChange }: PersonalStepProps) {
  return (
    <fieldset className="wizard__fieldset">
      <legend className="wizard__legend">Your details</legend>

      <FormField error={errors.name} id="name" label="Full name">
        {(describedBy) => (
          <input
            aria-describedby={describedBy}
            className="wizard__input"
            id="name"
            onChange={(event) => onChange('name', event.target.value)}
            value={data.name}
          />
        )}
      </FormField>

      <FormField error={errors.email} id="email" label="Email">
        {(describedBy) => (
          <input
            aria-describedby={describedBy}
            className="wizard__input"
            id="email"
            onChange={(event) => onChange('email', event.target.value)}
            type="email"
            value={data.email}
          />
        )}
      </FormField>

      <FormField error={errors.phone} id="phone" label="Phone">
        {(describedBy) => (
          <input
            aria-describedby={describedBy}
            className="wizard__input"
            id="phone"
            onChange={(event) => onChange('phone', event.target.value)}
            value={data.phone}
          />
        )}
      </FormField>
    </fieldset>
  )
}
