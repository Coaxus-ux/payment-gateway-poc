import { HiShoppingCart } from 'react-icons/hi'
import { cn } from '@/utils/cn'

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-2xl border-b border-dark/5">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-black text-lg">F</span>
          </div>
          <span className="font-black text-xl tracking-tighter text-dark">Fintech E-commerce Checkout</span>
        </div>
        <button
          id="cart-icon"
          type="button"
          onClick={onCartClick}
          className="relative p-4 bg-dark/5 rounded-2xl hover:bg-dark/10 transition-all active:scale-95"
        >
          <HiShoppingCart className="w-6 h-6 text-dark/70" />
          <span
            className={cn(
              'absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-xs font-black rounded-full flex items-center justify-center shadow-lg transition-all',
              cartCount > 0 ? 'scale-100' : 'scale-0'
            )}
          >
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  )
}
