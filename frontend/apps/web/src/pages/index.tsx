import {
  Button,
  ColumnLayout,
  CoverLayout,
  NativeLink,
  StackLayout,
  Text,
} from '@filecoin/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const HomePage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <Wrapper>
      <CoverLayout>
        <Text type="heading 1" semiBold align="center">
          {t('filecoin.home.sysTestMatrix')}
        </Text>
        <StackLayout gap={4} center style={{ maxWidth: '700px' }}>
          <Text type="text xl" color="textGray" semiBold align="center">
            {t('filecoin.home.subHeading')}
          </Text>

          <Text type="text xl" semiBold align="center">
            <i>{t('filecoin.home.paragraph1')}</i>
          </Text>
          <Text type="text xl" semiBold align="center">
            <i>{t('filecoin.home.paragraph2')}</i>
          </Text>
          <ColumnLayout style={{ maxWidth: '400px' }}>
            <Button
              color="primary"
              size="medium"
              variant="outline"
              onClick={() => (
                window.open(
                  'https://github.com/filecoin-project/system-test-matrix',
                ),
                '_blank'
              )}
            >
              <Text semiBold>{t('filecoin.home.git')}</Text>
            </Button>

            <Button
              color="primary"
              size="medium"
              variant="outline"
              onClick={() => navigate('/system')}
            >
              <Text semiBold>{t('filecoin.home.enter')}</Text>
            </Button>
          </ColumnLayout>
        </StackLayout>
        <Footer>
          <Text type="text xl" semiBold align="center">
            {t('filecoin.home.developedBy')}{' '}
            <NativeLink
              href="https://bloxico.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('filecoin.home.bloxico')}
            </NativeLink>
          </Text>
        </Footer>
      </CoverLayout>
    </Wrapper>
  )
}
export default HomePage

const Wrapper = styled.body`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`
const Footer = styled.div`
  margin-top: auto;
  margin-bottom: 1rem;
`
