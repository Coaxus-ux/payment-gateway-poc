import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Product } from '@/types'
import { usePageTransition } from '@/hooks'
import { MOCK_PRODUCTS } from '@/constants'
import { BackButton, ProductGallery, ProductInfo, ProductFeatures, ProductActions } from '@/components/product'

interface ProductDetailPageProps {
  onAddToCart: (product: Product, element: HTMLElement) => void
  onBuyNow: (product: Product) => void
}

export function ProductDetailPage({ onAddToCart, onBuyNow }: ProductDetailPageProps) {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { pageRef, animateOut } = usePageTransition()
  const imageRef = useRef<HTMLImageElement | null>(null)

  const product = MOCK_PRODUCTS.find((p) => p.id === productId)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-dark/50">Product not found</p>
      </div>
    )
  }

  const handleBack = () => {
    animateOut(() => navigate('/'))
  }

  const handleAddToCart = () => {
    if (imageRef.current) {
      onAddToCart(product, imageRef.current)
    }
  }

  const handleBuyNow = () => {
    onBuyNow(product)
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-white pb-32 sm:pb-12">
      <BackButton onClick={handleBack} />

      <div className="max-w-7xl mx-auto px-6 pt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <ProductGallery
          mainImage={product.image}
          productName={product.name}
          onImageRef={(ref) => {
            imageRef.current = ref
          }}
        />

        <div className="flex flex-col">
          <ProductInfo product={product} />
          <ProductFeatures />
          <ProductActions onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
        </div>
      </div>
    </div>
  )
}
