import { useRef, useEffect } from 'react'
import { HiPlus } from 'react-icons/hi'
import gsap from 'gsap'
import type { Product } from '@/types'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/pricing'

interface ProductCardProps {
  product: Product
  onBuyNow: (product: Product) => void
  onAddToCart: (product: Product, element: HTMLElement) => void
}

export function ProductCard({ product, onBuyNow, onAddToCart }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const isOutOfStock = product.stock <= 0

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 15
      const rotateY = (centerX - x) / 15
      const moveX = (x - centerX) / 10
      const moveY = (y - centerY) / 10

      gsap.to(card, {
        rotateX,
        rotateY,
        x: moveX,
        y: moveY,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000,
      })
    }

    const onMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      })
    }

    card.addEventListener('mousemove', onMouseMove)
    card.addEventListener('mouseleave', onMouseLeave)
    return () => {
      card.removeEventListener('mousemove', onMouseMove)
      card.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

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
      ref={cardRef}
      onClick={() => onBuyNow(product)}
      className="bg-white/60 backdrop-blur-md rounded-4xl p-5 shadow-premium group hover:shadow-elevated transition-shadow duration-500 flex flex-col h-full border border-white/40 cursor-pointer relative overflow-hidden"
    >
      <div className="relative aspect-4/3 mb-6 overflow-hidden rounded-3xl bg-muted shadow-inner">
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        <div className="absolute top-4 left-4 z-10">
          <span
            className={cn(
              'px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl shadow-lg border border-white/20',
              isOutOfStock ? 'bg-dark/20 text-dark/60' : 'bg-secondary/60 text-primary'
            )}
          >
            {isOutOfStock ? 'Sold Out' : `LTD EDTN — ${product.stock}`}
          </span>
        </div>
      </div>

      <div className="mb-6 px-1 grow">
        <h3 className="text-dark font-black text-2xl mb-2 leading-none tracking-tighter group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-dark/50 text-sm leading-relaxed font-medium line-clamp-2">{product.description}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-dark/5">
        <div className="flex flex-col">
          <span className="text-[9px] text-dark/30 font-black uppercase tracking-[0.25em]">MSRP</span>
          <span className="text-primary font-black text-xl sm:text-2xl tracking-tighter wrap-break-words leading-tight">
            {formatCurrency(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label="Add to cart"
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90',
              isOutOfStock ? 'bg-dark/5 text-dark/30 cursor-not-allowed' : 'bg-secondary/40 text-primary hover:bg-secondary/60 hover:rotate-90'
            )}
          >
            <HiPlus className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={cn(
              'flex-1 sm:flex-none px-6 h-12 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95',
              isOutOfStock ? 'bg-dark/5 text-dark/30 cursor-not-allowed shadow-none' : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20 hover:-translate-y-1'
            )}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  )
}
