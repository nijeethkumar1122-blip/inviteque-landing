import { useEffect, useRef, useState } from 'react'

/**
 * Hook for lazy loading images using Intersection Observer
 * Usage: const { ref, isVisible } = useLazyLoad()
 * Then use: <img ref={ref} loading="lazy" src={isVisible ? imageSrc : 'placeholder'} />
 */
export function useLazyLoad(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, {
      rootMargin: '50px',
      ...options,
    })

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [options])

  return { ref, isVisible }
}
