import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface UseDrawerAnimationOptions {
  isOpen: boolean
  direction?: 'left' | 'right'
}

export function useDrawerAnimation({ isOpen, direction = 'right' }: UseDrawerAnimationOptions) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  const translateValue = direction === 'right' ? '100%' : '-100%'

  useEffect(() => {
    if (isOpen) {
      gsap.to(backdropRef.current, { opacity: 1, display: 'block', duration: 0.3 })
      gsap.fromTo(drawerRef.current, { x: translateValue }, { x: '0%', duration: 0.5, ease: 'power4.out' })
    } else {
      gsap.to(drawerRef.current, { x: translateValue, duration: 0.4, ease: 'power4.in' })
      gsap.to(backdropRef.current, { opacity: 0, display: 'none', duration: 0.3 })
    }
  }, [isOpen, translateValue])

  return { drawerRef, backdropRef }
}
