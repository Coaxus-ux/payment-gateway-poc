import type { CheckoutStep } from '@/types'

const STEPS: CheckoutStep[] = ['PRODUCT_DETAIL', 'FORM', 'SUMMARY', 'RESULT']

interface CheckoutProgressProps {
  currentStep: CheckoutStep
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const currentStepIndex = STEPS.indexOf(currentStep)

  return (
    <div className="flex justify-center gap-2 mb-6">
      {STEPS.map((step, idx) => (
        <div key={step} className={`h-1 rounded-full transition-all duration-500 ${idx <= currentStepIndex ? 'w-8 bg-primary' : 'w-4 bg-dark/10'}`} />
      ))}
    </div>
  )
}
