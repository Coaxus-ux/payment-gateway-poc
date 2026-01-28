import { useRef, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { CheckoutStep, CheckoutData, PurchaseResult } from '@/types'
import { usePageTransition, useFlyingAnimation } from '@/hooks'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addItem, clearCart, removeItem, resetCheckoutData, setCheckoutData, updateQuantity } from '@/store/cart/slice'
import { selectCartItems, selectCartTotalItems, selectCheckoutData } from '@/store/cart/selectors'
import { selectProductById } from '@/store/products/selectors'
import { CartDrawer } from '@/components/CartDrawer'
import { CheckoutModal } from '@/components/CheckoutModal'
import { BackButton, ProductGallery, ProductInfo, ProductFeatures, ProductActions } from '@/components/product'
import { processPayment } from '@/utils/payment'

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { pageRef, animateOut } = usePageTransition()
  const imageRef = useRef<HTMLImageElement | null>(null)

  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const totalItems = useAppSelector(selectCartTotalItems)
  const checkoutData = useAppSelector(selectCheckoutData)

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep | null>(null)
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null)

  const { animate: flyToCart } = useFlyingAnimation({
    targetSelector: '#cart-icon',
    onComplete: undefined,
  })

  const product = useAppSelector((state) => selectProductById(state, productId ?? ''))

  const handleBack = useCallback(() => {
    animateOut(() => navigate('/'))
  }, [animateOut, navigate])

  const handleAddToCart = useCallback(() => {
    if (imageRef.current && product) {
      flyToCart(imageRef.current)
      dispatch(addItem(product))
    }
  }, [dispatch, flyToCart, product])

  const handleBuyNow = useCallback(() => {
    if (product) {
      dispatch(addItem(product))
      setCheckoutStep('PRODUCT_DETAIL')
    }
  }, [dispatch, product])

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

  const handleContinue = useCallback(
    (data: CheckoutData) => {
      dispatch(setCheckoutData(data))
      setCheckoutStep('SUMMARY')
    },
    [dispatch]
  )

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
  }, [])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-dark/50">Product not found</p>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-transparent pb-24 sm:pb-12">
      <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-3xl border-b border-white/40 px-8 py-6 transition-transform duration-700 ease-out header-anim">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-dark rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
              <span className="text-accent font-black text-3xl italic">N</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-dark tracking-tight leading-none">
                NEURAL<span className="text-primary">MOD</span>
              </h1>
              <span className="text-[9px] font-black tracking-[0.4em] text-dark/30 uppercase">Est. 2025</span>
            </div>
          </div>

          <button
            id="cart-icon"
            type="button"
            onClick={handleOpenCart}
            className="w-14 h-14 rounded-[20px] bg-white shadow-premium flex items-center justify-center border border-dark/5 hover:shadow-elevated hover:-translate-y-1 transition-all relative group"
          >
            <svg className="group-hover:scale-110 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white font-black text-[10px] w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>
      <BackButton onClick={handleBack} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 sm:pt-28 lg:pt-32 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7">
          <ProductGallery
            mainImage={product.image}
            productName={product.name}
            onImageRef={(ref) => {
              imageRef.current = ref
            }}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col pt-4 sm:pt-6 lg:pt-8">
          <ProductInfo product={product} />
          <ProductFeatures />
          <ProductActions onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
        </div>
      </div>

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
