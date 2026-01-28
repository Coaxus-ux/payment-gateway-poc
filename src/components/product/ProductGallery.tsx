import { useState, useCallback } from 'react'
import { useHeroImageAnimation } from '@/hooks'
import { cn } from '@/utils/cn'

interface ProductGalleryProps {
  mainImage: string
  productName: string
  onImageRef?: (ref: HTMLImageElement | null) => void
}

export function ProductGallery({ mainImage, productName, onImageRef }: ProductGalleryProps) {
  const { animateImage } = useHeroImageAnimation()
  const [selectedImage, setSelectedImage] = useState(mainImage)

  const gallery = [
    mainImage,
    `${mainImage}&auto=format&fit=crop&q=80&w=800&sat=-100`,
    `${mainImage}&auto=format&fit=crop&q=80&w=800&hue=180`,
  ]

  const handleImageRef = useCallback(
    (el: HTMLImageElement | null) => {
      animateImage(el)
      onImageRef?.(el)
    },
    [animateImage, onImageRef]
  )

  return (
    <div className="space-y-8">
      <div className="aspect-4/5 rounded-[48px] overflow-hidden bg-dark/5 shadow-2xl border border-white/40 group">
        <img
          ref={handleImageRef}
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s] ease-out"
        />
      </div>

      <div className="flex gap-6 detail-fade">
        {gallery.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedImage(img)}
            className={cn(
              'w-28 h-28 rounded-3xl overflow-hidden border-2 transition-all duration-500',
              selectedImage === img
                ? 'border-primary shadow-xl scale-110 ring-4 ring-primary/10'
                : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'
            )}
          >
            <img src={img} className="w-full h-full object-cover" alt={`Perspective ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  )
}
