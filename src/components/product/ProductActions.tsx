import { HiShoppingCart, HiPlus } from 'react-icons/hi'

interface ProductActionsProps {
  onAddToCart: () => void
  onBuyNow: () => void
}

export function ProductActions({ onAddToCart, onBuyNow }: ProductActionsProps) {
  return (
    <>
      <div className="hidden sm:flex items-center gap-4 detail-anim">
        <button
          type="button"
          onClick={onAddToCart}
          className="flex-1 py-6 px-8 rounded-3xl bg-secondary/20 text-primary font-black text-lg border border-primary/10 hover:bg-secondary/30 transition-all flex items-center justify-center gap-3"
        >
          Add to Bag
          <HiShoppingCart className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          className="flex-1 py-6 px-8 rounded-3xl bg-primary text-white font-black text-lg shadow-2xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 transition-all active:scale-95"
        >
          Buy Directly
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 sm:hidden z-50">
        <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-4xl shadow-elevated border border-white/20 flex gap-3">
          <button type="button" onClick={onAddToCart} className="w-16 h-16 rounded-2xl bg-secondary/30 text-primary flex items-center justify-center shadow-sm">
            <HiPlus className="w-6 h-6" />
          </button>
          <button type="button" onClick={onBuyNow} className="grow h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-lg active:scale-95 transition-transform">
            Instant Purchase
          </button>
        </div>
      </div>
    </>
  )
}
