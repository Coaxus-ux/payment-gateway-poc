import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useModalAnimation() {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
    tl.fromTo(modalRef.current, { y: 100, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power4.out' }, '-=0.2')
  }, [])

  const animateContent = () => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, { x: 10, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
    }
  }

  return { modalRef, contentRef, backdropRef, animateContent }
}
