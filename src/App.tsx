import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage, ProductDetailPage } from '@/pages'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
