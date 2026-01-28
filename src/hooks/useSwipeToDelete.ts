import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

interface UseSwipeToDeleteOptions {
  onDelete: () => void
  threshold?: number
}

export function useSwipeToDelete({ onDelete, threshold = -150 }: UseSwipeToDeleteOptions) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current

    const draggable = Draggable.create(element, {
      type: 'x',
      edgeResistance: 0.65,
      bounds: { minX: -500, maxX: 0 },
      inertia: true,
      onDrag() {
        const opacity = Math.max(0, 1 + this.x / 200)
        gsap.set(element, { opacity })
      },
      onDragEnd() {
        if (this.x < threshold) {
          gsap.to(element, {
            x: -500,
            opacity: 0,
            duration: 0.3,
            onComplete: onDelete,
          })
        } else {
          gsap.to(element, { x: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
        }
      },
    })

    return () => {
      draggable[0]?.kill()
    }
  }, [onDelete, threshold])

  return elementRef
}
