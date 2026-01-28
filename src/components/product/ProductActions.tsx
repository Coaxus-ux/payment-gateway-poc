import { HiShoppingCart, HiClipboardList } from 'react-icons/hi'

interface ProductActionsProps {
  onAddToCart: () => void
  onBuyNow: () => void
}

export function ProductActions({ onAddToCart, onBuyNow }: ProductActionsProps) {
  return (
    <>
      <div className="hidden sm:flex items-center gap-6 detail-fade">
        <button
          type="button"
          onClick={onAddToCart}
          className="grow py-8 px-10 rounded-4xl bg-dark text-white font-black text-xl hover:bg-dark/90 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-dark/20 flex items-center justify-center gap-4 group"
        >
          Add to Bag
          <HiShoppingCart className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          className="w-24 h-24 rounded-4xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-110 active:scale-90 transition-all"
        >
          <HiClipboardList className="w-8 h-8" />
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 sm:hidden z-50">
        <div className="bg-white/80 backdrop-blur-2xl p-4 rounded-4xl shadow-elevated border border-white/20 flex gap-3">
          <button
            type="button"
            onClick={onAddToCart}
            className="grow h-16 rounded-2xl bg-dark text-white font-black text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            Add to Bag
            <HiShoppingCart className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onBuyNow}
            className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-sm"
          >
            <HiClipboardList className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  )
}
