// TODO: refactor
import { alignPointer, relativePosition } from '@filecoin/core'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Button } from './Button'
import { Colors } from './styles/colors'

interface Props {
  toggler: any
  field: any
  left?: boolean
  right?: boolean
  bottom?: boolean
  pointer?: boolean
  forceClose?: boolean
  onClose?: Function
}

export const Menu = (props: Props) => {
  const myRef = useRef(null)
  const containerRef = useRef(null)
  const pointerRef = useRef(null)
  const [showField, setShow] = useState(false)

  const remove = e => {
    e.stopPropagation()
    const datepicker = document.getElementsByClassName(
      'flatpickr-calendar open',
    )
    if (myRef.current && myRef.current.contains(e.target)) {
      return
    } else if (datepicker[0] && datepicker[0].contains(e.target)) {
      return
    }
    if (props.onClose) {
      props.onClose()
    }
    setShow(false)
    document.removeEventListener('mouseup', remove, false)
  }

  const show = () => {
    if (!showField) {
      setTimeout(() => {
        document.addEventListener('mouseup', remove, false)
        setShow(true)
        relativePosition(
          myRef.current,
          containerRef.current,
          props.right,
          props.left,
          props.bottom,
        )
        alignPointer(pointerRef.current, containerRef.current)
      }, 100)
    }
  }

  useEffect(() => {
    if (myRef.current) {
      if (showField) {
        myRef.current.style.opacity = 0
        myRef.current.style.display = 'block'
        if (props.pointer) {
          pointerRef.current.style.opacity = 0
          pointerRef.current.style.display = 'block'
        }

        let last = +new Date()
        let opacity = 0
        const tick = () => {
          opacity =
            +myRef.current.style.opacity + (new Date().getTime() - last) / 250
          myRef.current.style.opacity = opacity
          if (props.pointer) {
            pointerRef.current.style.opacity = opacity
          }
          last = +new Date()

          if (+opacity < 1) {
            return (
              (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
              setTimeout(tick, 16)
            )
          }
        }

        tick()
      } else {
        myRef.current.style.display = 'none'
        if (props.pointer) {
          pointerRef.current.style.display = 'none'
        }
      }
    }
  }, [showField])

  useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', remove, false)
    }
  }, [])

  useEffect(() => {
    if (props.forceClose) {
      if (props.onClose) {
        props.onClose()
      }
      setShow(false)
      document.removeEventListener('mouseup', remove, false)
    }
  }, [props.forceClose])

  return (
    <Wrapper data-element="menuWrapper" ref={containerRef}>
      {React.cloneElement(props.toggler, {
        onMouseUp: () => show(),
      })}
      {props.pointer && showField && props.bottom && (
        <Pointer ref={pointerRef} />
      )}
      {showField
        ? React.cloneElement(
            <Element pointer={props.pointer && props.bottom}>
              {props.field}
            </Element>,
            {
              ref: node => (myRef.current = node),
            },
          )
        : null}
    </Wrapper>
  )
}

const Pointer = styled.div`
  display: none;
  width: 12px;
  height: 12px;
  position: absolute;
  background: #fff;
  z-index: 3;
  transform: rotate(45deg);
  border: 1px solid ${Colors.borderColor};

  &::after {
    content: '';
    position: absolute;
    top: 4px;
    background: #fff;
    width: 14px;
    height: 8px;
    left: 1px;
    transform: rotate(-45deg);
  }
`

const Wrapper = styled.span`
  display: flex;
  position: relative;

  button {
    justify-content: start;
  }
`

const Element = styled.div<{ pointer: boolean }>`
  color: ${Colors.grey};
  position: absolute;
  box-shadow: 0 3px 6px 0 ${Colors.shadowColor};
  border-radius: 3px;
  background-color: #fff;
  padding: 0.9rem 0;
  display: none;
  z-index: 2;
  white-space: nowrap;
  ${props => {
    return props.pointer
      ? `
    transform: translateY(8px);
    border: 1px solid ${Colors.borderColor};
    border-radius: 3px;
  `
      : ''
  }}
`

export const MenuItem = styled(Button)`
  width: 100%;
  padding: 0.5rem 1.4rem;
  display: flex;
  justify-content: flex-start;
  font-size: 1rem;

  i {
    padding-right: 1rem;
  }
`
