import { useCallback, useEffect, useRef } from 'react'
import throttle from 'lodash.throttle'

export const useThrottle = (
  cb: CallableFunction,
  delay: number,
  options = { leading: true, trailing: false },
) => {
  const cbRef = useRef(cb)
  // use mutable ref to make useCallback/throttle not depend on `cb` dep
  useEffect(() => {
    cbRef.current = cb
  })
  return useCallback(
    throttle((...args) => cbRef.current(...args), delay, options),
    [delay, options],
  )
}
