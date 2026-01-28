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

  const gallery = [mainImage, `${mainImage}&blur=2`, `${mainImage}&grayscale=1`]

  const handleImageRef = useCallback(
    (el: HTMLImageElement | null) => {
      animateImage(el)
      onImageRef?.(el)
    },
    [animateImage, onImageRef]
  )

  return (
    <div className="space-y-6">
      <div className="aspect-4/5 rounded-[40px] overflow-hidden bg-dark/5 shadow-elevated border border-dark/5">
        <img ref={handleImageRef} src={selectedImage} alt={productName} className="w-full h-full object-cover" />
      </div>

      <div className="flex gap-4 detail-anim">
        {gallery.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedImage(img)}
            className={cn(
              'w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all',
              selectedImage === img ? 'border-primary shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
            )}
          >
            <img src={img} className="w-full h-full object-cover" alt={`${productName} angle ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  )
}
