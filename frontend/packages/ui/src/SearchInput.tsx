import { useDebounce } from '@filecoin/core'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { BaseInput } from './BaseInput'
import { Icon } from './Icon'
import { Loader } from './Loader'
import { Colors } from './styles/colors'

interface SearchInputProps {
  onSearch: (query: string) => any
  value?: string
  width?: string | number
  autoFocus?: boolean
  placeholder?: string
}

export const SearchInput: FunctionComponent<SearchInputProps> = ({
  onSearch = () => null,
  value,
  autoFocus = true,
  placeholder,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [query, setQuery] = useState(value || '')
  const debouncedValue = useDebounce(query, 500)
  const inputRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (loaded) {
      setIsLoading(false)
      onSearch(query)
    } else {
      setLoaded(true)
    }
  }, [debouncedValue])

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <SearchIconWrapper width={props.width}>
      <BaseInput
        iconBefore="search"
        value={query}
        onChange={event => {
          setIsLoading(true)
          setQuery(event.currentTarget.value)
        }}
        ref={inputRef}
        placeholder={placeholder || t('global.placeholders.search')}
        {...props}
      />

      {(isLoading && <SearchLoader />) ||
        (query && (
          <CancelWrapper
            onClick={() => {
              setIsLoading(true)
              setQuery('')
            }}
          >
            <Icon name="close" color="gray" />
          </CancelWrapper>
        ))}
    </SearchIconWrapper>
  )
}

const SearchLoader = styled(Loader)`
  margin: auto;
  width: 1rem;
  height: 1rem;
  border: 4px solid rgb(255 255 255 60%);
  border-left-color: ${Colors.darkBlue};

  ::after {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
  }
`

// TODO@all I had to put the style of the icon in wrapper because styled(Icon) had some issue with passing props
const SearchIconWrapper = styled.div<Pick<SearchInputProps, 'width'>>`
  display: flex;
  position: relative;
  width: ${({ width }) => width || '100%'};

  input {
    background-color: ${Colors.ghostBtn};
  }

  > span {
    position: absolute;
    top: 50%;
    color: ${Colors.grey};
    left: 0.5rem;
    pointer-events: none;
    transform: translateY(-50%);
  }

  span {
    background: none !important;
    margin-left: 0 !important;
  }

  > button {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
  }

  ${SearchLoader} {
    position: absolute;
    top: 16px;
    right: 16px;
  }
`
const CancelWrapper = styled.button`
  height: 46px;
  width: 38px;
  display: flex;
  border: none;
  background-color: ${Colors.ghostBtn};

  svg {
    margin: auto;
  }
`
