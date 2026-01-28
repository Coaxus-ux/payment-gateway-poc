import { useCallback } from 'react'
import gsap from 'gsap'

export function useHeroImageAnimation() {
  const animateImage = useCallback((element: HTMLImageElement | null) => {
    if (element) {
      gsap.fromTo(element, { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 })
    }
  }, [])

  return { animateImage }
}

export function useHeroImageRef(onRef?: (el: HTMLImageElement | null) => void) {
  const { animateImage } = useHeroImageAnimation()

  const setRef = useCallback(
    (el: HTMLImageElement | null) => {
      animateImage(el)
      onRef?.(el)
    },
    [animateImage, onRef]
  )

  return setRef
}
