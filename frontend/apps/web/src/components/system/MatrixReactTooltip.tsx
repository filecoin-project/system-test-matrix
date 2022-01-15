import React from 'react'
import { useTranslation } from 'react-i18next'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

const MatrixReactTooltip = () => {
  const { t } = useTranslation()
  return (
    <ReactTooltip
      effect="solid"
      multiline
      getContent={data => {
        const { id, feature, description } = JSON.parse(data) || {}

        return (
          <TooltipWrapper>
            <div>
              <b>{t('filecoin.matrix.behaviorId')}</b>: <span>{id}</span>
            </div>

            <div>
              <b>{t('filecoin.matrix.featureId')}</b>: <span>{feature}</span>
            </div>

            <div>
              <b>{t('filecoin.matrix.desc')}</b>: <span>{description}</span>
            </div>
          </TooltipWrapper>
        )
      }}
    />
  )
}
const TooltipWrapper = styled.div`
  max-width: 400px;
`
export default MatrixReactTooltip
