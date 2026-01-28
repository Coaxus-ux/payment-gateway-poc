import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import type { Product, CheckoutStep, CheckoutData, PurchaseResult } from '@/types'
import { useFlyingAnimation } from '@/hooks'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addItem, clearCart, removeItem, resetCheckoutData, setCheckoutData, updateQuantity } from '@/store/cart/slice'
import { selectCartItems, selectCartTotalItems, selectCheckoutData } from '@/store/cart/selectors'
import { selectProducts } from '@/store/products/selectors'
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

  const catalogRef = useRef<HTMLDivElement>(null)

  const { animate: flyToCart } = useFlyingAnimation({
    targetSelector: '#cart-icon',
    onComplete: undefined,
  })

  useEffect(() => {
    if (!catalogRef.current) return

    const tl = gsap.timeline()
    tl.fromTo('.header-anim', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' })
      .fromTo('.hero-title-anim', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }, '-=0.6')
      .fromTo('.product-card-anim', { scale: 0.9, y: 60, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power4.out' }, '-=0.8')
  }, [])

  const handleAddToCart = useCallback(
    (product: Product, element: HTMLElement) => {
      flyToCart(element)
      dispatch(addItem(product))
    },
    [dispatch, flyToCart],
  )

  const handleBuyNow = useCallback(
    (product: Product) => {
      navigate(`/product/${product.id}`)
    },
    [navigate],
  )

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
    [dispatch],
  )

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
    <div className="min-h-screen pb-12 bg-transparent selection:bg-primary selection:text-white">
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

      <main>
        <div className="max-w-6xl mx-auto px-8 py-16" ref={catalogRef}>
          <div className="mb-20 hero-title-anim">
            <span className="text-[10px] font-black tracking-[0.5em] text-primary uppercase mb-4 block">Future Forward</span>
            <h2 className="text-6xl sm:text-8xl font-black text-dark tracking-tighter leading-[0.85] mb-6">
              Experience
              <br />
              The Zenith.
            </h2>
            <p className="text-xl text-dark/40 font-medium max-w-lg">Advanced biological-to-digital hardware. Performance without compromise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {products.map((product) => (
              <div key={product.id} className="product-card-anim opacity-0">
                <ProductCard product={product} onBuyNow={handleBuyNow} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
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
