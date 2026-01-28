import { useCallback } from 'react'
import gsap from 'gsap'

interface FlyingAnimationOptions {
  targetSelector: string
  onComplete?: () => void
}

export function useFlyingAnimation({ targetSelector, onComplete }: FlyingAnimationOptions) {
  const animate = useCallback(
    (sourceElement: HTMLElement) => {
      const target = document.querySelector(targetSelector)
      if (!target) {
        onComplete?.()
        return
      }

      const sourceRect = sourceElement.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()

      const flyingEl = document.createElement('div')
      flyingEl.className = 'flying-item'
      flyingEl.style.cssText = `
        width: ${sourceRect.width}px;
        height: ${sourceRect.height}px;
        left: ${sourceRect.left}px;
        top: ${sourceRect.top}px;
      `

      const img = sourceElement.cloneNode(true) as HTMLElement
      img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;'
      flyingEl.appendChild(img)
      document.body.appendChild(flyingEl)

      gsap.to(flyingEl, {
        x: targetRect.left - sourceRect.left + targetRect.width / 2 - sourceRect.width / 2,
        y: targetRect.top - sourceRect.top,
        scale: 0.1,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          flyingEl.remove()
          onComplete?.()
        },
      })

      gsap.to(target, {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
        delay: 0.4,
      })
    },
    [targetSelector, onComplete]
  )

  return { animate }
}
