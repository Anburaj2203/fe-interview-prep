import type { ReactNode } from 'react'

type FormFieldProps = {
  error?: string
  id: string
  label: string
  children: (describedBy: string | undefined) => ReactNode
}

export function FormField({ error, id, label, children }: FormFieldProps) {
  const errorId = `${id}-error`

  return (
    <p className="wizard__field">
      <label className="wizard__label" htmlFor={id}>
        {label}
      </label>
      {children(error === undefined ? undefined : errorId)}
      {error === undefined ? null : (
        <span className="wizard__error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </p>
  )
}
