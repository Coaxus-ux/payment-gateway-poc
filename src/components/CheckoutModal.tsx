import { useEffect } from 'react'
import type { CardData, CartItem, CheckoutCustomer, CheckoutDelivery, CheckoutStep, Product, PurchaseResult } from '@/types'
import { useModalAnimation } from '@/hooks'
import { ProductDetailStep, BillingFormStep, OrderSummaryStep, CheckoutResultStep } from './checkout'

interface CheckoutModalProps {
  product: Product | null
  items: CartItem[]
  amount: number
  currency: string
  customer: CheckoutCustomer
  delivery: CheckoutDelivery
  step: CheckoutStep
  onClose: () => void
  onStartCheckout: () => void
  onContinue: (data: { customer: CheckoutCustomer; delivery: CheckoutDelivery; card: CardData }) => void
  onConfirm: () => void
  onUpdateDelivery: (delivery: CheckoutDelivery) => void
  isCreatingTransaction?: boolean
  isPaying?: boolean
  isUpdatingDelivery?: boolean
  onBack: () => void
  purchaseResult: PurchaseResult | null
  onFinish: () => void
  onRetry: () => void
  onEditBilling: () => void
}

export function CheckoutModal({
  product,
  items,
  amount,
  currency,
  customer,
  delivery,
  step,
  onClose,
  onStartCheckout,
  onContinue,
  onConfirm,
  onUpdateDelivery,
  isCreatingTransaction,
  isPaying,
  isUpdatingDelivery,
  onBack,
  purchaseResult,
  onFinish,
  onRetry,
  onEditBilling,
}: CheckoutModalProps) {
  const { modalRef, contentRef, backdropRef, animateContent } = useModalAnimation()

  useEffect(() => {
    animateContent()
  }, [step, animateContent])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div ref={backdropRef} onClick={onClose} className="absolute inset-0 bg-dark/40 backdrop-blur-md opacity-0" />
      <div ref={modalRef} className="bg-white w-full sm:max-w-xl sm:rounded-[40px] rounded-t-[40px] shadow-2xl relative z-10 overflow-hidden transform-gpu">
        <div ref={contentRef}>
          {step === 'PRODUCT_DETAIL' && <ProductDetailStep product={product} items={items} onClose={onClose} onContinue={onStartCheckout} />}
          {step === 'FORM' && (
            <BillingFormStep initialCustomer={customer} initialDelivery={delivery} onBack={onBack} onSubmit={onContinue} isSubmitting={isCreatingTransaction} />
          )}
          {step === 'SUMMARY' && (
            <OrderSummaryStep
              items={items}
              amount={amount}
              currency={currency}
              customer={customer}
              delivery={delivery}
              onUpdateDelivery={onUpdateDelivery}
              onPay={onConfirm}
              isPaying={isPaying}
              isUpdatingDelivery={isUpdatingDelivery}
            />
          )}
          {step === 'RESULT' && (
            <CheckoutResultStep result={purchaseResult} onFinish={onFinish} onRetry={onRetry} onEditBilling={onEditBilling} isPaying={isPaying} />
          )}
        </div>
      </div>
    </div>
  )
}
