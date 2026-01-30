import { useRef, useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { CardData, CheckoutCustomer, CheckoutDelivery, CheckoutStep, PurchaseResult } from '@/types'
import { usePageTransition, useFlyingAnimation } from '@/hooks'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  addItem,
  clearCart,
  removeItem,
  resetCheckoutData,
  setCheckoutCustomer,
  setCheckoutDelivery,
  setCheckoutIds,
  setCheckoutRequestId,
  setCheckoutSelection,
  updateItemPrice,
  updateQuantity,
} from '@/store/cart/slice'
import {
  selectCartItems,
  selectCartTotalItems,
  selectCheckoutCustomer,
  selectCheckoutDelivery,
  selectCheckoutIds,
  selectCheckoutSelection,
} from '@/store/cart/selectors'
import { fetchProductById } from '@/store/products/slice'
import { selectProductById, selectProductDetailError, selectProductDetailStatus } from '@/store/products/selectors'
import { CartDrawer } from '@/components/CartDrawer'
import { CheckoutModal } from '@/components/CheckoutModal'
import { BackButton, ProductGallery, ProductInfo, ProductFeatures, ProductActions } from '@/components/product'
import { Toast, type ToastVariant } from '@/components/Toast'
import { createTransaction, payTransaction, updateDelivery } from '@/api/transactions'
import { isApiError } from '@/api/client'

interface ToastState {
  message: string
  variant?: ToastVariant
  requestId?: string
}

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { pageRef, animateOut } = usePageTransition()
  const imageRef = useRef<HTMLImageElement | null>(null)

  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const totalItems = useAppSelector(selectCartTotalItems)
  const checkoutSelection = useAppSelector(selectCheckoutSelection)
  const checkoutCustomer = useAppSelector(selectCheckoutCustomer)
  const checkoutDelivery = useAppSelector(selectCheckoutDelivery)
  const checkoutIds = useAppSelector(selectCheckoutIds)
  const detailStatus = useAppSelector(selectProductDetailStatus)
  const detailError = useAppSelector(selectProductDetailError)

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep | null>(null)
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResult | null>(null)
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [isUpdatingDelivery, setIsUpdatingDelivery] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const { animate: flyToCart } = useFlyingAnimation({
    targetSelector: '#cart-icon',
    onComplete: undefined,
  })

  const product = useAppSelector((state) => (productId ? selectProductById(state, productId) : undefined))

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId))
    }
  }, [dispatch, productId])

  const showToast = useCallback((message: string, variant: ToastVariant = 'info', requestId?: string) => {
    setToast({ message, variant, requestId })
  }, [])

  const buildSelectionFromCart = useCallback(() => {
    if (items.length === 0) return null
    const currency = items[0].currency ?? 'COP'
    return {
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        currency: item.currency,
      })),
      amount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      currency,
    }
  }, [items])

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
      dispatch(
        setCheckoutSelection({
          items: [
            {
              id: product.id,
              quantity: 1,
              price: product.price,
              currency: product.currency,
            },
          ],
          amount: product.price,
          currency: product.currency ?? 'COP',
        })
      )
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
    if (items.length === 0) return
    const currency = items[0].currency ?? 'COP'
    const hasMixedCurrency = items.some((item) => (item.currency ?? currency) !== currency)
    if (hasMixedCurrency) {
      showToast('El carrito tiene monedas diferentes. Ajusta los productos.', 'error')
      return
    }
    const selectionItems = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      currency: item.currency,
    }))
    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    dispatch(setCheckoutSelection({ items: selectionItems, amount, currency }))
    setIsCartOpen(false)
    setCheckoutStep('PRODUCT_DETAIL')
  }, [dispatch, items, showToast])

  const handleStartCheckout = useCallback(() => {
    setCheckoutStep('EMAIL')
  }, [])

  const handleLookupEmail = useCallback(
    (data: { customer: CheckoutCustomer; delivery: CheckoutDelivery }) => {
      dispatch(setCheckoutCustomer(data.customer))
      dispatch(setCheckoutDelivery(data.delivery))
      setCheckoutStep('FORM')
    },
    [dispatch]
  )

  const handleContinue = useCallback(
    async (data: { customer: CheckoutCustomer; delivery: CheckoutDelivery; card: CardData }) => {
      const selection = buildSelectionFromCart() ?? checkoutSelection

      if (!selection) {
        showToast('Selecciona un producto primero.', 'error')
        return
      }
      const hasMixedCurrency = selection.items.some((item) => (item.currency ?? selection.currency) !== selection.currency)
      if (hasMixedCurrency) {
        showToast('El carrito tiene monedas diferentes. Ajusta los productos.', 'error')
        return
      }

      setIsCreatingTransaction(true)
      setCardData(data.card)
      dispatch(setCheckoutCustomer(data.customer))
      dispatch(setCheckoutDelivery(data.delivery))

      try {
        const response = await createTransaction({
          items: selection.items.map((item) => ({ productId: item.id, quantity: item.quantity })),
          amount: selection.amount,
          currency: selection.currency,
          customer: data.customer,
          delivery: data.delivery,
        })

        const transactionId = response.data.transactionId ?? response.data.id
        if (!transactionId) {
          throw new Error('Missing transaction id')
        }

        dispatch(setCheckoutIds({ transactionId, deliveryId: response.data.deliveryId }))
        dispatch(setCheckoutRequestId(response.requestId))
        setCheckoutStep('SUMMARY')
      } catch (error) {
        if (isApiError(error)) {
          dispatch(setCheckoutRequestId(error.requestId))
          if (error.code === 'OUT_OF_STOCK') {
            showToast('Producto sin stock. Revisa el detalle.', 'error', error.requestId)
            setCheckoutStep(null)
            return
          }
          if (error.code === 'AMOUNT_MISMATCH') {
            try {
              const updates = await Promise.all(
                selection.items.map((item) => dispatch(fetchProductById(item.id)).unwrap())
              )
              updates.forEach((updated) => {
                dispatch(updateItemPrice({ id: updated.data.id, price: updated.data.price, currency: updated.data.currency }))
              })
              const nextItems = selection.items.map((item) => {
                const updated = updates.find((entry) => entry.data.id === item.id)
                return {
                  ...item,
                  price: updated?.data.price ?? item.price,
                  currency: updated?.data.currency ?? item.currency,
                }
              })
              const nextCurrency = nextItems[0]?.currency ?? selection.currency
              const nextAmount = nextItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
              dispatch(setCheckoutSelection({ items: nextItems, amount: nextAmount, currency: nextCurrency }))
              showToast('Precios actualizados desde el backend. Revisa el monto.', 'info', error.requestId)
            } catch {
              showToast(error.message, 'error', error.requestId)
            }
            return
          }
          showToast(error.message, 'error', error.requestId)
        } else {
          showToast('No se pudo crear la transacción.', 'error')
        }
      } finally {
        setIsCreatingTransaction(false)
      }
    },
    [buildSelectionFromCart, checkoutSelection, dispatch, showToast]
  )

  const handleUpdateDelivery = useCallback(
    async (delivery: CheckoutDelivery) => {
      if (!checkoutIds.transactionId || !checkoutIds.deliveryId) {
        showToast('No hay una entrega activa para actualizar.', 'error')
        return
      }

      setIsUpdatingDelivery(true)
      try {
        const response = await updateDelivery(checkoutIds.deliveryId, checkoutIds.transactionId, delivery)
        dispatch(setCheckoutDelivery(delivery))
        dispatch(setCheckoutRequestId(response.requestId))
        showToast('Entrega actualizada.', 'success', response.requestId)
      } catch (error) {
        if (isApiError(error)) {
          dispatch(setCheckoutRequestId(error.requestId))
          showToast(error.message, 'error', error.requestId)
        } else {
          showToast('No se pudo actualizar la entrega.', 'error')
        }
      } finally {
        setIsUpdatingDelivery(false)
      }
    },
    [checkoutIds.deliveryId, checkoutIds.transactionId, dispatch, showToast]
  )

  const handleConfirm = useCallback(async () => {
    if (!checkoutIds.transactionId) {
      showToast('Falta el transactionId.', 'error')
      return
    }
    if (!cardData) {
      showToast('Ingresa los datos de la tarjeta.', 'error')
      return
    }

    setIsPaying(true)
    try {
      const response = await payTransaction(checkoutIds.transactionId, cardData)
      dispatch(setCheckoutRequestId(response.requestId))
      const normalizedStatus = response.data.status?.toUpperCase()
      const isSuccess = normalizedStatus === 'SUCCESS' || normalizedStatus === 'PAID' || normalizedStatus === 'APPROVED'
      const isFailed = normalizedStatus === 'FAILED' || normalizedStatus === 'DECLINED'
      const message = response.data.message ?? (isSuccess ? 'Pago aprobado.' : 'Pago rechazado. Intenta nuevamente.')

      setPurchaseResult({
        status: isSuccess && !isFailed ? 'success' : 'error',
        transactionId: response.data.transactionId ?? checkoutIds.transactionId,
        message,
        requestId: response.requestId,
      })
      setCheckoutStep('RESULT')
    } catch (error) {
      if (isApiError(error)) {
        dispatch(setCheckoutRequestId(error.requestId))
        const message = error.code === 'PAYMENT_FAILED' ? 'Pago rechazado. Intenta nuevamente.' : error.message
        setPurchaseResult({ status: 'error', message, requestId: error.requestId })
        setCheckoutStep('RESULT')
      } else {
        setPurchaseResult({ status: 'error', message: 'No se pudo procesar el pago.' })
        setCheckoutStep('RESULT')
      }
    } finally {
      setIsPaying(false)
    }
  }, [cardData, checkoutIds.transactionId, dispatch, showToast])

  const handleBackStep = useCallback(() => {
    setCheckoutStep('PRODUCT_DETAIL')
  }, [])

  const handleFinish = useCallback(() => {
    const selectedProductId = checkoutSelection?.items?.[0]?.id ?? productId
    setCheckoutStep(null)
    setPurchaseResult(null)
    setCardData(null)
    dispatch(clearCart())
    dispatch(resetCheckoutData())
    if (selectedProductId) {
      dispatch(fetchProductById(selectedProductId))
    }
  }, [checkoutSelection?.items, dispatch, productId])

  const handleRetry = useCallback(() => {
    if (!cardData) {
      setCheckoutStep('FORM')
      setPurchaseResult(null)
      return
    }
    void handleConfirm()
  }, [cardData, handleConfirm])

  const handleEditBilling = useCallback(() => {
    setCardData(null)
    setCheckoutStep('FORM')
    setPurchaseResult(null)
  }, [])

  const handleCloseModal = useCallback(() => {
    setCheckoutStep(null)
    setPurchaseResult(null)
    setCardData(null)
  }, [])

  if (detailStatus === 'loading' && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-dark/50">Cargando producto...</p>
      </div>
    )
  }

  if (detailStatus === 'failed' && detailError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{detailError.message}</p>
      </div>
    )
  }

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
            images={product.images}
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
          product={product}
          items={items}
          amount={checkoutSelection?.amount ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? product.price}
          currency={checkoutSelection?.currency ?? items[0]?.currency ?? product.currency ?? 'COP'}
          customer={checkoutCustomer}
          delivery={checkoutDelivery}
          step={checkoutStep}
          onClose={handleCloseModal}
          onStartCheckout={handleStartCheckout}
          onLookupEmail={handleLookupEmail}
          onContinue={handleContinue}
          onConfirm={handleConfirm}
          onUpdateDelivery={handleUpdateDelivery}
          isCreatingTransaction={isCreatingTransaction}
          isPaying={isPaying}
          isUpdatingDelivery={isUpdatingDelivery}
          onBack={handleBackStep}
          purchaseResult={purchaseResult}
          onFinish={handleFinish}
          onRetry={handleRetry}
          onEditBilling={handleEditBilling}
        />
      )}

      {toast && <Toast message={toast.message} variant={toast.variant} requestId={toast.requestId} onDismiss={() => setToast(null)} />}
    </div>
  )
}
