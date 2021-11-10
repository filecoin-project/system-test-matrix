import { useState, useEffect } from 'react'

import { Breakpoint, getBreakpointMediaQuery } from '../utilities'

/**
 * The query for a screen narrower than a given breakpoint.
 */
export interface ScreenSmallerThanQuery {
  /**
   * The breakpoint to watch for.
   */
  readonly screenSmallerThan: Breakpoint
}

/**
 * The query for a screen wide at least as a given breakpoint.
 */
export interface ScreenAtLeastQuery {
  /**
   * The breakpoint to watch for.
   */
  readonly screenAtLeast: Breakpoint
}

/**
 * Observes the given media query and returns a boolean indicating whether the
 * media query is matched or not.
 *
 * @param mediaQuery The media query to observe.
 * @example
 *  const isMobile = useMedia('(max-width: 623px)');
 */
export function useMedia(mediaQuery: string): boolean

/**
 * Observes the screen width and returns a boolean indicating whether
 * it is wide at least as the given breakpoint.
 *
 * @param query The query specifying the breakpoint to observe.
 * @example
 *  const isDesktop = useMedia({ screenAtLeast: 'desktop' });
 */
export function useMedia(query: ScreenAtLeastQuery): boolean

/**
 * Observes the screen width and returns a boolean indicating whether
 * it is narrower than the given breakpoint.
 *
 * @param query The query specifying the breakpoint to observe.
 * @example
 *  const isMobile = useMedia({ screenSmallerThan: 'tablet' });
 */
export function useMedia(query: ScreenSmallerThanQuery): boolean

export function useMedia(
  query: string | ScreenAtLeastQuery | ScreenSmallerThanQuery,
): boolean {
  const mediaQuery =
    typeof query === 'object'
      ? 'screenAtLeast' in query
        ? getBreakpointMediaQuery('>=', query.screenAtLeast)
        : getBreakpointMediaQuery('<', query.screenSmallerThan)
      : query

  const [matches, setMatches] = useState(() => {
    if (typeof window.matchMedia === 'function') {
      return window.matchMedia(mediaQuery).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return
    }
    const mediaQueryList = window.matchMedia(mediaQuery)
    setMatches(mediaQueryList.matches)

    function listener() {
      setMatches(mediaQueryList.matches)
    }

    mediaQueryList.addListener(listener)
    return () => {
      mediaQueryList.removeListener(listener)
    }
  }, [mediaQuery])

  return matches
}
