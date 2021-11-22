import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

import { Button } from './Button'
import { CenterLayout, PageLayout } from './Layouts'
import { Colors } from './styles/colors'
import { Text } from './Text'
import { Icon } from './Icon'

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
   * Title of the modal. Default is 'Details'
   */
  title?: string
}

export const Modal: FunctionComponent<ModalProps> = ({
  isOpen = false,
  onClose,
  title = 'Details',
  ...props
}) => {
  return isOpen ? (
    <Container>
      <Backdrop />
      <Content gap={2}>
        <Header>
          <Text type="text xl" bold={true}>
            {title}
          </Text>
          <Icon
            name="close"
            size="large"
            color="black"
            className="c-icon"
            onClick={onClose}
          />
        </Header>
        {props.children}
        <PageLayout.Footer height={4.5}>
          <CloseButton variant="outline" size="medium" onClick={onClose}>
            Cancel
          </CloseButton>
        </PageLayout.Footer>
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
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0;
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
  padding: 0;
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

const Header = styled.div`
  display: flex;
  width: 100%;
  min-width: 12rem;
  padding: 0.75rem 1.5rem 0.5rem;
  border-bottom: 1px solid ${Colors.borderColor};
  .c-icon {
    align-self: center;
    margin-left: auto;
    cursor: pointer;
  }
`

const CloseButton = styled(Button)`
  margin: auto;
`
