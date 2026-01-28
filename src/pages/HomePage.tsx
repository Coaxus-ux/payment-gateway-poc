import { useNavigate } from 'react-router-dom'
import type { Product } from '@/types'
import { MOCK_PRODUCTS } from '@/constants'
import { ProductCard } from '@/components/ProductCard'

interface HomePageProps {
  onAddToCart: (product: Product, element: HTMLElement) => void
}

export function HomePage({ onAddToCart }: HomePageProps) {
  const navigate = useNavigate()

  const handleBuyNow = (product: Product) => {
    navigate(`/product/${product.id}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-dark tracking-tighter mb-2">Store</h1>
          <p className="text-dark/50">Premium products for modern living</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} onBuyNow={handleBuyNow} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </div>
  )
}
