import { useEffect, useState } from 'react'

const usePageVisibility = (
  callback: (arg0: boolean) => void,
  dependencies: Array<any> = [],
): boolean => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const cb = () => {
      setIsVisible(!document.hidden)
    }
    document.addEventListener('visibilitychange', cb)
    return () => document.removeEventListener('visibilitychange', cb)
  }, [callback])

  useEffect(() => {
    callback(isVisible)
  }, [callback, isVisible, ...dependencies])

  return isVisible
}

export default usePageVisibility
