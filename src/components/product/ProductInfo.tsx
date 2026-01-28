import type { Product } from '@/types'
import { formatCurrency } from '@/utils/pricing'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <>
      <div className="detail-anim mb-4">
        <span className="bg-secondary/30 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Premium Technology</span>
      </div>

      <h1 className="text-5xl sm:text-7xl font-black text-dark tracking-tighter leading-none mb-6 detail-anim">{product.name}</h1>

      <div className="flex items-center gap-6 mb-10 detail-anim">
        <div className="flex flex-col">
          <span className="text-[10px] text-dark/30 font-black uppercase tracking-widest">Price</span>
          <span className="text-4xl font-black text-primary tracking-tighter">{formatCurrency(product.price)}</span>
        </div>
        <div className="h-12 w-px bg-dark/5" />
        <div className="flex flex-col">
          <span className="text-[10px] text-dark/30 font-black uppercase tracking-widest">Availability</span>
          <span className="text-xl font-bold text-dark">{product.stock} Units left</span>
        </div>
      </div>

      <p className="text-lg text-dark/60 leading-relaxed mb-12 detail-anim max-w-xl">{product.longDescription}</p>
    </>
  )
}
