import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function usePageTransition() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.set('.detail-anim', { opacity: 0, y: 30 })

    const tl = gsap.timeline()
    tl.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }).to(
      '.detail-anim',
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      },
      '-=0.3'
    )

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const animateOut = (onComplete: () => void) => {
    gsap.to(pageRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      onComplete,
    })
  }

  return { pageRef, animateOut }
}
