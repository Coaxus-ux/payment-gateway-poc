import type { Product } from '@/types'
import { formatCurrency } from '@/utils/pricing'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <>
      <div className="mb-6 detail-fade">
        <span className="bg-primary/10 text-primary px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.3em] border border-primary/10">
          Limited Edition Series
        </span>
      </div>

      <h1 className="text-6xl sm:text-8xl font-black text-dark tracking-tighter leading-[0.85] mb-10 overflow-hidden">
        {product.name.split(' ').map((word, i) => (
          <span key={i} className="inline-block mr-4">
            <span className="inline-block reveal-text">{word}</span>
          </span>
        ))}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 mb-10 sm:mb-12 detail-fade">
        <div className="flex flex-col">
          <span className="text-[10px] text-dark/30 font-black uppercase tracking-[0.4em] mb-2">Value</span>
          <span className="text-4xl sm:text-5xl font-black text-primary tracking-tighter">{formatCurrency(product.price)}</span>
        </div>
        <div className="hidden sm:block h-16 w-px bg-dark/10" />
        <div className="flex flex-col">
          <span className="text-[10px] text-dark/30 font-black uppercase tracking-[0.4em] mb-2">Stock</span>
          <span className="text-xl sm:text-2xl font-bold text-dark">{product.stock} left</span>
        </div>
      </div>

      <p className="text-xl text-dark/60 leading-relaxed mb-16 detail-fade font-medium">{product.longDescription}</p>
    </>
  )
}
