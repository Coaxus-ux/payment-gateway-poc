import { BrowserRouter, Routes, Route } from 'react-router-dom'
import type { Product } from '@/types'
import { HomePage, ProductDetailPage } from '@/pages'

export default function App() {
  const handleAddToCart = (product: Product, element: HTMLElement) => {
    console.log('Add to cart:', product.name, element)
  }

  const handleBuyNow = (product: Product) => {
    console.log('Buy now:', product.name)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
        <Route
          path="/product/:productId"
          element={<ProductDetailPage onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />}
        />
      </Routes>
    </BrowserRouter>
  )
}
