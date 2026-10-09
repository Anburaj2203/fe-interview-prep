import { FormField } from './FormField'
import { COUNTRIES, type Registration, type TextField } from './types'
import type { FieldErrors } from './validation'

type AddressStepProps = {
  data: Registration
  errors: FieldErrors
  onChange: (field: TextField, value: string) => void
}

export function AddressStep({ data, errors, onChange }: AddressStepProps) {
  return (
    <fieldset className="wizard__fieldset">
      <legend className="wizard__legend">Address</legend>

      <FormField error={errors.country} id="country" label="Country">
        {(describedBy) => (
          <select
            aria-describedby={describedBy}
            className="wizard__input"
            id="country"
            onChange={(event) => onChange('country', event.target.value)}
            value={data.country}
          >
            <option value="">Choose a country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        )}
      </FormField>

      <FormField error={errors.city} id="city" label="City">
        {(describedBy) => (
          <input
            aria-describedby={describedBy}
            className="wizard__input"
            id="city"
            onChange={(event) => onChange('city', event.target.value)}
            value={data.city}
          />
        )}
      </FormField>

      <FormField error={errors.postalCode} id="postalCode" label="Postal code">
        {(describedBy) => (
          <input
            aria-describedby={describedBy}
            className="wizard__input"
            id="postalCode"
            onChange={(event) => onChange('postalCode', event.target.value)}
            value={data.postalCode}
          />
        )}
      </FormField>
    </fieldset>
  )
}
