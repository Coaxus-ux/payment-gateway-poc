import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product, CheckoutStep, CheckoutData, PurchaseResult } from '@/types'
import { useFlyingAnimation } from '@/hooks'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addItem, clearCart, removeItem, resetCheckoutData, setCheckoutData, updateQuantity } from '@/store/cart/slice'
import { selectCartItems, selectCartTotalItems, selectCheckoutData } from '@/store/cart/selectors'
import { selectProducts } from '@/store/products/selectors'
import { Header } from '@/components/Header'
import { ProductCard } from '@/components/ProductCard'
import { CartDrawer } from '@/components/CartDrawer'
import { CheckoutModal } from '@/components/CheckoutModal'
import { processPayment } from '@/utils/payment'

export function HomePage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const totalItems = useAppSelector(selectCartTotalItems)
  const checkoutData = useAppSelector(selectCheckoutData)
  const products = useAppSelector(selectProducts)

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep | null>(null)
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null)
  const [checkoutItem, setCheckoutItem] = useState<Product | null>(null)

  const { animate: flyToCart } = useFlyingAnimation({
    targetSelector: '#cart-icon',
    onComplete: undefined,
  })

  const handleAddToCart = useCallback(
    (product: Product, element: HTMLElement) => {
      flyToCart(element)
      dispatch(addItem(product))
    },
    [dispatch, flyToCart]
  )

  const handleBuyNow = useCallback((product: Product) => {
    navigate(`/product/${product.id}`)
  }, [navigate])

  const handleOpenCart = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  const handleCloseCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false)
    setCheckoutStep('PRODUCT_DETAIL')
  }, [])

  const handleStartCheckout = useCallback(() => {
    setCheckoutStep('FORM')
  }, [])

  const handleContinue = useCallback((data: CheckoutData) => {
    dispatch(setCheckoutData(data))
    setCheckoutStep('SUMMARY')
  }, [dispatch])

  const handleConfirm = useCallback(async () => {
    const result = await processPayment(checkoutData)
    setPurchaseResult(result)
    setCheckoutStep('RESULT')
  }, [checkoutData])

  const handleBack = useCallback(() => {
    setCheckoutStep('PRODUCT_DETAIL')
  }, [])

  const handleFinish = useCallback(() => {
    setCheckoutStep(null)
    setPurchaseResult(null)
    dispatch(clearCart())
    dispatch(resetCheckoutData())
  }, [dispatch])

  const handleRetry = useCallback(() => {
    setCheckoutStep('FORM')
    setPurchaseResult(null)
  }, [])

  const handleCloseModal = useCallback(() => {
    setCheckoutStep(null)
    setPurchaseResult(null)
    setCheckoutItem(null)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header cartCount={totalItems} onCartClick={handleOpenCart} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-dark tracking-tighter mb-2">Store</h1>
          <p className="text-dark/50">Premium products for modern living</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onBuyNow={handleBuyNow} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        items={items}
        onUpdateQuantity={(id, delta) => dispatch(updateQuantity({ id, delta }))}
        onRemove={(id) => dispatch(removeItem(id))}
        onCheckout={handleCheckout}
      />

      {checkoutStep && (
        <CheckoutModal
          cartItems={checkoutItem ? [{ ...checkoutItem, quantity: 1 }] : items}
          step={checkoutStep}
          checkoutData={checkoutData}
          onClose={handleCloseModal}
          onStartCheckout={handleStartCheckout}
          onContinue={handleContinue}
          onConfirm={handleConfirm}
          onBack={handleBack}
          purchaseResult={purchaseResult}
          onFinish={handleFinish}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}
