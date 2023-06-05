import { useState, useEffect } from 'react'
import Commission from './listing'

const Stale = ({ Character }: { Character: string }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  const contentID = 'stale-commission-' + `${Character}`

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById(contentID)
      if (element) {
        const { top } = element.getBoundingClientRect()
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight
        if (top <= windowHeight) {
          setIsLoaded(true)
          window.removeEventListener('scroll', handleScroll)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [contentID]) // Add contentID to the dependency array

  return (
    <div id={contentID}>
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
