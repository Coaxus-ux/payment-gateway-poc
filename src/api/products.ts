import type { Product } from '@/types'
import { fetchJson } from './client'

interface ApiProduct {
  id: string
  name: string
  description: string
  priceAmount: number
  currency: string
  stock?: { units?: number }
  imageUrl?: string
  imageUrls?: string[]
  longDescription?: string
}

const buildFallbackImage = (name: string) => {
  const label = encodeURIComponent(name || 'Product')
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1f2937"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="40">${label}</text>
    </svg>`
  )}`
}

const mapProduct = (product: ApiProduct): Product => ({
  id: product.id,
  name: product.name,
  description: product.description,
  longDescription: product.longDescription ?? product.description,
  price: product.priceAmount,
  currency: product.currency,
  stock: product.stock?.units ?? 0,
  image: product.imageUrl ?? product.imageUrls?.[0] ?? buildFallbackImage(product.name),
  images: product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : undefined),
})

export async function getProducts() {
  const response = await fetchJson<ApiProduct[]>('/products')
  return { ...response, data: response.data.map(mapProduct) }
}

export async function getProductById(productId: string) {
  const response = await fetchJson<ApiProduct>(`/products/${productId}`)
  return { ...response, data: mapProduct(response.data) }
}
