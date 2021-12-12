import React from 'react'
import styled from 'styled-components'

import { Dropdown } from './Dropdown/Dropdown'
import { Colors } from './styles/colors'
import { Text } from './Text'

interface Props {
  currentPage: number
  totalRecords: number
  pageLimit: number
  onChange: Function
}

export const Pager: React.FC<Props> = ({
  currentPage,
  totalRecords,
  pageLimit,
  onChange,
}) => {
  const handleChange = event => onChange(+event.value)

  return (
    <Wrapper>
      <PageLimitSelectorWrapper>
        <Text type="text s" color="gray90">
          Rows per page:
        </Text>
        <DropdownStyled
          options={[
            { label: '5', value: '5' },
            { label: '10', value: '10' },
            { label: '20', value: '20' },
          ]}
          value={pageLimit.toString()}
          onChange={handleChange}
        />
      </PageLimitSelectorWrapper>
      <PageIndicator>
        <Text type="text s" color="gray90">
          {currentPage * pageLimit - pageLimit + 1}-
          {currentPage * pageLimit > totalRecords
            ? totalRecords
            : currentPage * pageLimit}{' '}
          of {totalRecords}
        </Text>
      </PageIndicator>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  margin-top: 0.3rem;
`

const PageLimitSelectorWrapper = styled.div`
  display: flex;
`

const DropdownStyled = styled(Dropdown)`
  width: 5.5rem;
  color: ${Colors.gray80};
  border: 0;

  &:hover,
  &:focus {
    border: 0 !important;
  }

  & > div:first-of-type > div {
    height: 1.5rem;
    margin-top: 0.1rem;
    padding-right: 3.45rem;

    span {
      font-size: 0.9rem;
      color: ${Colors.gray80};
    }

    svg {
      width: 1rem !important;
      height: 1rem !important;
      fill: ${Colors.gray80};
    }
  }

  & > div:last-of-type {
    top: 2rem !important;
    border-top: 1px solid;
    border-top-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
  }
`

const PageIndicator = styled.span`
  margin-left: auto;
`
