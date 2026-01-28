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

      const flyingEl = sourceElement.cloneNode(true) as HTMLElement
      flyingEl.className = 'flying-item'
      flyingEl.style.width = `${sourceRect.width}px`
      flyingEl.style.height = `${sourceRect.height}px`
      flyingEl.style.left = `${sourceRect.left}px`
      flyingEl.style.top = `${sourceRect.top}px`
      document.body.appendChild(flyingEl)

      const targetLeft = targetRect.left + targetRect.width / 2 - 25
      const targetTop = targetRect.top + targetRect.height / 2 - 25

      const tl = gsap.timeline({
        onComplete: () => {
          flyingEl.remove()
          gsap.fromTo(
            target,
            { scale: 1, rotate: 0 },
            { scale: 1.5, rotate: -15, duration: 0.3, yoyo: true, repeat: 1, ease: 'back.out(3)' }
          )
          onComplete?.()
        },
      })

      tl.to(flyingEl, {
        duration: 1,
        left: targetLeft,
        top: targetTop,
        width: 50,
        height: 50,
        opacity: 0,
        scale: 0.1,
        rotate: 360,
        ease: 'power4.inOut',
      })
    },
    [targetSelector, onComplete]
  )

  return { animate }
}
