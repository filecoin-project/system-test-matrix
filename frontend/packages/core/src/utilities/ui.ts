export const truncate = (input: string, length = 16) => {
  if (input.length > length) {
    return input.substring(0, length) + '...'
  } else {
    return input
  }
}

export const getHiddenElementDimensions = element => {
  const dimensions: any = {}
  if (element) {
    element.style.visibility = 'hidden'
    element.style.display = 'block'
    dimensions.width = element.offsetWidth
    dimensions.height = element.offsetHeight
    element.style.display = 'none'
    element.style.visibility = 'visible'
  }
  return dimensions
}

export const getViewport = () => {
  const win = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    w = win.innerWidth || e.clientWidth || g.clientWidth,
    h = win.innerHeight || e.clientHeight || g.clientHeight

  return { width: w, height: h }
}

export const relativePosition = (
  element,
  target,
  rightMenu = false,
  leftMenu = false,
  bottomRightMenu = false,
) => {
  if (element) {
    const elementDimensions = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : getHiddenElementDimensions(element)
    const targetHeight = target.offsetHeight
    const targetOffset = target.getBoundingClientRect()
    const viewport = getViewport()
    let top, left
    if (!bottomRightMenu) {
      if (
        targetOffset.top + targetHeight + elementDimensions.height >
        viewport.height
      ) {
        top =
          (leftMenu || rightMenu ? targetHeight : 1) +
          -0.97 * elementDimensions.height
        if (targetOffset.top + top < 0) {
          top =
            -1 *
            (leftMenu || rightMenu
              ? targetOffset.top - targetHeight
              : targetOffset.top)
        }
      } else {
        top = leftMenu || rightMenu ? 0 : targetHeight
      }

      if (elementDimensions.width > viewport.width) {
        left = targetOffset.left * -1
      } else if (
        ((rightMenu ? targetOffset.right : targetOffset.left) +
          elementDimensions.width >
          viewport.width &&
          !leftMenu) ||
        (leftMenu && targetOffset.left - elementDimensions.width < 0)
      ) {
        left =
          (targetOffset.left + elementDimensions.width - viewport.width) * -1
        if (
          leftMenu &&
          viewport.width - targetOffset.right - elementDimensions.width > 0
        ) {
          left = target.offsetWidth
        } else if (
          rightMenu &&
          targetOffset.left - elementDimensions.width > 0
        ) {
          left = elementDimensions.width * -1
        } else if (top === 0) {
          top = targetHeight
        } else if (top < 0) {
          top -= targetHeight
        }
      } else {
        left = leftMenu
          ? elementDimensions.width * -1
          : rightMenu
          ? target.offsetWidth
          : 0
      }
    } else {
      top = targetHeight
      left = target.offsetWidth - elementDimensions.width
    }

    element.style.top = top + 'px'
    element.style.left = left + 'px'
    return top
  }
}

const getWindowScrollTop = () => {
  const doc = document.documentElement
  return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
}

const getWindowScrollLeft = () => {
  const doc = document.documentElement
  return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0)
}

export const absolutePosition = (element, target, rightMenu = false) => {
  if (element) {
    const elementDimensions = element.offsetParent
      ? { width: element.offsetWidth, height: element.offsetHeight }
      : getHiddenElementDimensions(element)
    const elementOuterHeight = elementDimensions.height
    const elementOuterWidth = elementDimensions.width
    const targetOuterHeight = target.offsetHeight
    const targetOuterWidth = target.offsetWidth
    const targetOffset = target.getBoundingClientRect()
    const windowScrollTop = getWindowScrollTop()
    const windowScrollLeft = getWindowScrollLeft()
    const viewport = getViewport()
    let top: number, left: number

    if (
      targetOffset.top + targetOuterHeight + elementOuterHeight >
      viewport.height
    ) {
      top =
        targetOffset.top +
        windowScrollTop -
        elementOuterHeight +
        (rightMenu ? targetOuterHeight / 2 : 0)
      if (top < 0) {
        top = windowScrollTop
      }
    } else {
      top =
        targetOffset.top +
        windowScrollTop +
        (rightMenu ? targetOuterHeight / 2 : targetOuterHeight)
    }

    if (
      targetOffset.left + targetOuterWidth + elementOuterWidth >
      viewport.width
    ) {
      left = Math.max(
        0,
        targetOffset.left +
          windowScrollLeft +
          targetOuterWidth -
          elementOuterWidth,
      )
    } else if (rightMenu) {
      left = targetOffset.left + windowScrollLeft + targetOuterWidth
    } else {
      left = targetOffset.left + targetOuterWidth / 2 + windowScrollLeft
    }

    element.style.top = top + 'px'
    element.style.left = left + 'px'
  }
}

export const findSingle = (element: HTMLElement, selector: string) => {
  if (element) {
    return element.querySelector(selector)
  }
  return null
}

export const getOuterHeight = (el: HTMLElement, margin = null) => {
  if (el) {
    let height = el.offsetHeight

    if (margin) {
      const style = getComputedStyle(el)
      height += parseFloat(style.marginTop) + parseFloat(style.marginBottom)
    }

    return height
  }
  return 0
}

export const alignPointer = (element: HTMLElement, target) => {
  if (element) {
    const targetHeight = target.offsetHeight
    const top = targetHeight + 2
    const left = target.offsetWidth / 2 - 6
    element.style.top = top + 'px'
    element.style.left = left + 'px'
  }
}

export const scrollInView = (container, item) => {
  const borderTopValue =
    getComputedStyle(container).getPropertyValue('borderTopWidth')
  const borderTop = borderTopValue ? parseFloat(borderTopValue) : 0
  const paddingTopValue =
    getComputedStyle(container).getPropertyValue('paddingTop')
  const paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0
  const containerRect = container.getBoundingClientRect()
  const itemRect = item.getBoundingClientRect()
  const offset =
    itemRect.top +
    document.body.scrollTop -
    (containerRect.top + document.body.scrollTop) -
    borderTop -
    paddingTop
  const scroll = container.scrollTop
  const elementHeight = container.clientHeight
  const itemHeight = getOuterHeight(item)

  if (offset < 0) {
    container.scrollTop = scroll + offset
  } else if (offset + itemHeight > elementHeight) {
    container.scrollTop = scroll + offset - elementHeight + itemHeight
  }
}

export const addClass = (element, className) => {
  if (element) {
    if (element.classList) {
      element.classList.add(className)
    } else {
      element.className += ' ' + className
    }
  }
}

export const removeClass = (element, className) => {
  if (element) {
    if (element.classList) {
      element.classList.remove(className)
    } else {
      element.className = element.className.replace(
        new RegExp(
          '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
          'gi',
        ),
        ' ',
      )
    }
  }
}

export const hasClass = (element, className) => {
  if (element) {
    if (element.classList) {
      return element.classList.contains(className)
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(
        element.className,
      )
    }
  }
}
