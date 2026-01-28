import { useRef } from 'react'
import { HiPlus } from 'react-icons/hi'
import type { Product } from '@/types'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/pricing'

interface ProductCardProps {
  product: Product
  onBuyNow: (product: Product) => void
  onAddToCart: (product: Product, element: HTMLElement) => void
}

export function ProductCard({ product, onBuyNow, onAddToCart }: ProductCardProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const isOutOfStock = product.stock <= 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (imageRef.current) {
      onAddToCart(product, imageRef.current)
    }
  }

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation()
    onBuyNow(product)
  }

  return (
    <div
      onClick={() => onBuyNow(product)}
      className="bg-white rounded-2xl p-4 shadow-premium group hover:shadow-elevated transition-all duration-500 flex flex-col h-full border border-dark/5 cursor-pointer"
    >
      <div className="relative aspect-4/3 mb-5 overflow-hidden rounded-2xl bg-muted">
        <img ref={imageRef} src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              'px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-sm border border-white/20',
              isOutOfStock ? 'bg-dark/20 text-dark/60' : 'bg-secondary/40 text-primary',
            )}
          >
            {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
          </span>
        </div>
      </div>

      <div className="mb-5 grow">
        <h3 className="text-dark font-bold text-xl mb-2 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-dark/50 text-sm leading-relaxed">{product.description}</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-dark/5">
        <div className="flex flex-col">
          <span className="text-[10px] text-dark/40 font-bold uppercase tracking-wider">Starting at</span>
          <span className="text-primary font-black text-2xl tracking-tighter">{formatCurrency(product.price)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label="Add to cart"
            className={cn('p-3 rounded-xl transition-all active:scale-95', isOutOfStock ? 'bg-dark/5 text-dark/30 cursor-not-allowed' : 'bg-secondary/30 text-primary hover:bg-secondary/50')}
          >
            <HiPlus className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={cn(
              'px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95',
              isOutOfStock ? 'bg-dark/5 text-dark/30 cursor-not-allowed shadow-none' : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20',
            )}
          >
            View
          </button>
        </div>
      </div>
    </div>
  )
}
