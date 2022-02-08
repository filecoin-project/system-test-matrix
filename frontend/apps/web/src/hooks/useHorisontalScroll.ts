import { useEffect, useRef } from 'react'

export function useHorizontalScroll() {
  const elRef = useRef<HTMLDivElement>()

  useEffect(() => {
    const el = elRef.current

    if (el) {
      const onWheel = e => {
        if (e.deltaY === 0) {
          return
        }
        if (
          !(el.scrollLeft === 0 && e.deltaY < 0) &&
          !(
            el.scrollWidth - el.clientWidth - Math.round(el.scrollLeft) === 0 &&
            e.deltaY > 0
          )
        ) {
          e.preventDefault()
        }
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          behavior: 'auto',
        })
      }
      el.addEventListener('wheel', onWheel)
      return () => el.removeEventListener('wheel', onWheel)
    }
  }, [])
  return elRef
}
