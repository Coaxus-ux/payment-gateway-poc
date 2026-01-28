import { HiX, HiArrowRight } from 'react-icons/hi'
import type { CartItem } from '@/types'
import { calculateSubtotal, formatCurrency } from '@/utils/pricing'
import { useDrawerAnimation } from '@/hooks'
import { CartItemRow } from './CartItemRow'
import { EmptyCart } from './EmptyCart'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, delta: number) => void
  onRemove: (id: string) => void
  onCheckout: () => void
}

export function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout }: CartDrawerProps) {
  const { drawerRef, backdropRef } = useDrawerAnimation({ isOpen })

  const subtotal = calculateSubtotal(items)
  const currency = items[0]?.currency

  return (
    <>
      <div ref={backdropRef} onClick={onClose} className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-60 hidden opacity-0" />
      <div ref={drawerRef} className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-70 shadow-2xl flex flex-col transform translate-x-full">
        <div className="p-6 border-b border-dark/5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-dark tracking-tighter leading-none mb-1">Your Bag</h2>
            <span className="text-[10px] text-dark/40 font-bold uppercase tracking-widest">Swipe left to remove</span>
          </div>
          <button type="button" onClick={onClose} className="p-3 bg-dark/5 rounded-2xl hover:bg-dark/10 transition-colors">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <div className="grow overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? <EmptyCart /> : items.map((item) => <CartItemRow key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />)}
        </div>

        {items.length > 0 && (
          <div className="p-8 bg-white border-t border-dark/5 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-dark/30 text-[10px] font-bold uppercase tracking-widest block mb-1">Total Savings</span>
                <span className="text-primary font-bold text-xs">Free shipping active</span>
              </div>
              <div className="text-right">
                <span className="text-dark/30 text-[10px] font-bold uppercase tracking-widest block mb-1">Subtotal</span>
                <span className="text-3xl font-black text-dark tracking-tighter leading-none">{formatCurrency(subtotal, currency)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="w-full py-5 rounded-2xl bg-primary text-white font-black shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              Secure Checkout
              <HiArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}
