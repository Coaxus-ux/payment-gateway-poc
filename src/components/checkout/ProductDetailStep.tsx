import { HiX } from 'react-icons/hi'
import type { CartItem } from '@/types'
import { CheckoutProgress } from './CheckoutProgress'

interface ProductDetailStepProps {
  item: CartItem | undefined
  onClose: () => void
  onContinue: () => void
}

export function ProductDetailStep({ item, onClose, onContinue }: ProductDetailStepProps) {
  return (
    <div className="p-8">
      <CheckoutProgress currentStep="PRODUCT_DETAIL" />
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-black text-dark tracking-tighter">Item Detail</h2>
        <button type="button" onClick={onClose} className="p-2 bg-dark/5 rounded-xl">
          <HiX className="w-5 h-5" />
        </button>
      </div>
      {item && (
        <>
          <div className="aspect-video rounded-3xl overflow-hidden mb-6 shadow-lg border border-dark/5">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold text-dark">{item.name}</h3>
            <p className="text-dark/60 text-sm leading-relaxed">{item.longDescription}</p>
          </div>
        </>
      )}
      <button type="button" onClick={onContinue} className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all active:scale-95">
        Continue to Checkout
      </button>
    </div>
  )
}
