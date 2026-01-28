import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function usePageTransition() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.set('.reveal-text', { y: '110%' })
    gsap.set('.detail-fade', { opacity: 0, y: 20 })

    const tl = gsap.timeline()

    tl.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 })
      .to(
        '.reveal-text',
        {
          y: '0%',
          duration: 1,
          stagger: 0.15,
          ease: 'power4.out',
        },
        '-=0.4'
      )
      .to(
        '.detail-fade',
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        },
        '-=0.5'
      )

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const animateOut = (onComplete: () => void) => {
    gsap.to(pageRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete,
    })
  }

  return { pageRef, animateOut }
}
