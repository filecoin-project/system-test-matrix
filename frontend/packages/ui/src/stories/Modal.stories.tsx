import { Meta } from '@storybook/react'
import React, { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Button } from '..'
import { Icon } from '../Icon'
import { StackLayout } from '../Layouts'
import { Modal } from '../Modal'
import { Text } from '../Text'

export default {
  title: 'Modal',
  component: Modal,
} as Meta

export const ModalExample = args => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <Fragment>
      <Button
        onClick={() => {
          handleOpen()
        }}
        size={'medium'}
        variant={'rounded'}
      >
        Open Modal
      </Button>
      <Modal {...args} isOpen={isOpen} onClose={handleClose} />
    </Fragment>
  )
}

export const VerificationStatus = args => {
  const { t } = useTranslation()
  return (
    <Modal {...args} isOpen={true}>
      <Container center gap={1.5}>
        <CircleIcon />
        <Text type="text xl" bold>
          {t('iam.modal.verificationStatus')}
        </Text>
        <Text color="gray80">{t('iam.modal.description')}</Text>
      </Container>
      <OkButton variant="rounded" size={'medium'}>
        {t('iam.modal.okBtn')}
      </OkButton>
    </Modal>
  )
}

const CircleIcon = styled.div`
  padding: 20px;
  border: 1px solid gray;
  border-radius: 50%;
`
const Container = styled(StackLayout)`
  width: 450px;
  text-align: center;

  @media (max-width: 420px) {
    width: 320px;
    margin-top: auto;
    margin-bottom: auto;
  }
`
const OkButton = styled(Button)`
  margin-top: 36px;

  @media (max-width: 420px) {
    width: 100%;
  }
`
