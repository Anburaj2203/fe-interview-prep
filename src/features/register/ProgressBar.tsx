import { STEPS } from './types'

type ProgressBarProps = {
  step: number
}

export function ProgressBar({ step }: ProgressBarProps) {
  return (
    <p className="wizard__progress" role="status">
      Step {step + 1} of {STEPS.length}: {STEPS[step]}
    </p>
  )
}
