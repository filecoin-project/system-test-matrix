import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

import { Button } from './Button'
import { CenterLayout } from './Layouts'
import { Colors } from './styles/colors'

export interface ModalProps {
  /**
   * Boolean value that defines if modal is open or closed
   */
  isOpen?: boolean
  /**
   * Function that defines click event
   */
  onClick?: () => void
  /**
   * Function that defines closing of modal
   */
  onClose?: () => void
  /**
   * Boolean value that defines if close button should be displayed
   */
  showCloseButton?: boolean
}

export const Modal: FunctionComponent<ModalProps> = ({
  isOpen = false,
  onClose,
  showCloseButton = true,
  ...props
}) => {
  return isOpen ? (
    <Container>
      <Backdrop />
      <Content gap={2}>
        {showCloseButton && (
          <CloseButton
            variant="icon"
            appearance="blank"
            icon="close"
            onClick={onClose}
          />
        )}
        {props.children}
      </Content>
    </Container>
  ) : null
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Backdrop = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: ${Colors.modalBackgroud};
  backdrop-filter: blur(1px);
  opacity: 0.9;
`

const Content = styled(CenterLayout)`
  position: absolute;
  max-width: 100vw;
  max-height: 100vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 45px;
  background: ${Colors.white};
  box-shadow: 0 8px 15px ${Colors.shadowColor};
  border-radius: 9px;
  color: ${Colors.textColor};
  z-index: 101;

  @media (max-width: 420px) {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0;
    height: auto;
  }
`
const CloseButton = styled(Button)`
  margin-left: auto;
`
