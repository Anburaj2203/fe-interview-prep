import type { Registration, StepIndex } from './types'

type ReviewStepProps = {
  data: Registration
  onEdit: (step: StepIndex) => void
}

export function ReviewStep({ data, onEdit }: ReviewStepProps) {
  const sections: Array<{ step: StepIndex; title: string; rows: Array<[string, string]> }> = [
    {
      step: 0,
      title: 'Your details',
      rows: [
        ['Full name', data.name],
        ['Email', data.email],
        ['Phone', data.phone],
      ],
    },
    {
      step: 1,
      title: 'Address',
      rows: [
        ['Country', data.country],
        ['City', data.city],
        ['Postal code', data.postalCode],
      ],
    },
    {
      step: 2,
      title: 'Preferences',
      rows: [
        ['Plan', data.plan],
        ['Skills', data.skills.join(', ')],
      ],
    },
  ]

  return (
    <div className="wizard__review">
      <h3 className="wizard__legend">Review</h3>

      {sections.map((section) => (
        <section className="wizard__review-section" key={section.title}>
          <h4 className="wizard__review-title">{section.title}</h4>
          <dl className="wizard__review-list">
            {section.rows.map(([label, value]) => (
              <div className="wizard__review-row" key={label}>
                <dt className="wizard__review-label">{label}</dt>
                <dd className="wizard__review-value">{value}</dd>
              </div>
            ))}
          </dl>
          <button
            aria-label={`Edit ${section.title}`}
            className="wizard__button"
            onClick={() => onEdit(section.step)}
            type="button"
          >
            Edit
          </button>
        </section>
      ))}
    </div>
  )
}
