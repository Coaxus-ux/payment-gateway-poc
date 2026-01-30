import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PurchaseResult } from '@/types'
import { CheckoutResultStep } from './CheckoutResultStep'

describe('CheckoutResultStep', () => {
  it('handles retry and edit billing actions', async () => {
    const user = userEvent.setup()
    const onRetry = jest.fn()
    const onEditBilling = jest.fn()
    const result: PurchaseResult = { status: 'error', message: 'Declined' }

    render(
      <CheckoutResultStep result={result} onFinish={() => undefined} onRetry={onRetry} onEditBilling={onEditBilling} />
    )

    await user.click(screen.getByRole('button', { name: 'Retry Payment' }))
    expect(onRetry).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Cambiar datos de facturación' }))
    expect(onEditBilling).toHaveBeenCalledTimes(1)
  })

  it('disables retry button while paying', () => {
    const result: PurchaseResult = { status: 'error', message: 'Declined' }

    render(
      <CheckoutResultStep
        result={result}
        onFinish={() => undefined}
        onRetry={() => undefined}
        onEditBilling={() => undefined}
        isPaying
      />
    )

    expect(screen.getByRole('button', { name: 'Retrying...' })).toBeDisabled()
  })
})
