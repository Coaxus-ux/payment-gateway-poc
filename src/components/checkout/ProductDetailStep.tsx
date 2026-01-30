import { HiX } from 'react-icons/hi'
import type { CartItem, Product } from '@/types'
import { calculateLineTotal, formatCurrency } from '@/utils/pricing'
import { CheckoutProgress } from './CheckoutProgress'

interface ProductDetailStepProps {
  product: Product | null
  items: CartItem[]
  onClose: () => void
  onContinue: () => void
}

export function ProductDetailStep({ product, items, onClose, onContinue }: ProductDetailStepProps) {
  return (
    <div className="p-8">
      <CheckoutProgress currentStep="PRODUCT_DETAIL" />
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-black text-dark tracking-tighter">Item Detail</h2>
        <button type="button" onClick={onClose} className="p-2 bg-dark/5 rounded-xl">
          <HiX className="w-5 h-5" />
        </button>
      </div>
      {items.length > 0 ? (
        <div className="space-y-4 mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-dark/40 font-black">Items</p>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white/70 rounded-2xl p-3 border border-dark/5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-dark/5 shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-dark">{item.name}</p>
                  <p className="text-xs text-dark/50">Qty {item.quantity}</p>
                </div>
                <div className="text-sm font-black text-primary">
                  {formatCurrency(calculateLineTotal(item), item.currency)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : product ? (
        <>
          <div className="aspect-video rounded-3xl overflow-hidden mb-6 shadow-lg border border-dark/5">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-dark">{product.name}</h3>
              <span className="text-sm font-black text-primary">{formatCurrency(product.price, product.currency)}</span>
            </div>
            <p className="text-dark/60 text-sm leading-relaxed">{product.longDescription}</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-dark/40 font-black">Stock {product.stock}</p>
          </div>
        </>
      ) : null}
      <button type="button" onClick={onContinue} className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95">
        Continue to Checkout
      </button>
    </div>
  )
}
