import { useRef, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { CheckoutStep, CheckoutData, PurchaseResult } from '@/types'
import { usePageTransition, useCartState, useFlyingAnimation } from '@/hooks'
import { MOCK_PRODUCTS } from '@/constants'
import { Header } from '@/components/Header'
import { CartDrawer } from '@/components/CartDrawer'
import { CheckoutModal } from '@/components/CheckoutModal'
import { BackButton, ProductGallery, ProductInfo, ProductFeatures, ProductActions } from '@/components/product'
import { processPayment } from '@/utils/payment'

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { pageRef, animateOut } = usePageTransition()
  const imageRef = useRef<HTMLImageElement | null>(null)

  const { items, totalItems, checkoutData, setCheckoutData, addItem, updateQuantity, removeItem, clearCart, resetCheckoutData } = useCartState()

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep | null>(null)
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null)

  const { animate: flyToCart } = useFlyingAnimation({
    targetSelector: '#cart-icon',
    onComplete: undefined,
  })

  const product = MOCK_PRODUCTS.find((p) => p.id === productId)

  const handleBack = useCallback(() => {
    animateOut(() => navigate('/'))
  }, [animateOut, navigate])

  const handleAddToCart = useCallback(() => {
    if (imageRef.current && product) {
      flyToCart(imageRef.current)
      addItem(product)
    }
  }, [flyToCart, addItem, product])

  const handleBuyNow = useCallback(() => {
    if (product) {
      addItem(product)
      setCheckoutStep('PRODUCT_DETAIL')
    }
  }, [addItem, product])

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
    setCheckoutData(data)
    setCheckoutStep('SUMMARY')
  }, [setCheckoutData])

  const handleConfirm = useCallback(async () => {
    const result = await processPayment(checkoutData)
    setPurchaseResult(result)
    setCheckoutStep('RESULT')
  }, [checkoutData])

  const handleBackStep = useCallback(() => {
    setCheckoutStep('PRODUCT_DETAIL')
  }, [])

  const handleFinish = useCallback(() => {
    setCheckoutStep(null)
    setPurchaseResult(null)
    clearCart()
    resetCheckoutData()
  }, [clearCart, resetCheckoutData])

  const handleRetry = useCallback(() => {
    setCheckoutStep('FORM')
    setPurchaseResult(null)
  }, [])

  const handleCloseModal = useCallback(() => {
    setCheckoutStep(null)
    setPurchaseResult(null)
  }, [])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-dark/50">Product not found</p>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-white pb-32 sm:pb-12">
      <Header cartCount={totalItems} onCartClick={handleOpenCart} />
      <BackButton onClick={handleBack} />

      <div className="max-w-7xl mx-auto px-6 pt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <ProductGallery
          mainImage={product.image}
          productName={product.name}
          onImageRef={(ref) => {
            imageRef.current = ref
          }}
        />

        <div className="flex flex-col">
          <ProductInfo product={product} />
          <ProductFeatures />
          <ProductActions onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
        </div>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onCheckout={handleCheckout}
      />

      {checkoutStep && (
        <CheckoutModal
          cartItems={items}
          step={checkoutStep}
          checkoutData={checkoutData}
          onClose={handleCloseModal}
          onStartCheckout={handleStartCheckout}
          onContinue={handleContinue}
          onConfirm={handleConfirm}
          onBack={handleBackStep}
          purchaseResult={purchaseResult}
          onFinish={handleFinish}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}
