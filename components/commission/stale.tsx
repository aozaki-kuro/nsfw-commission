import { useEffect, useRef, useState } from 'react'
import Commission from './listing'

const Stale = ({ Character }: { Character: string }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={ref}>
      {isLoaded ? (
        <div>
          <Commission Character={Character} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default Stale
