import { useDebounce } from '@filecoin/core'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { BaseInput } from './BaseInput'
import { Button } from './Button'
import { Icon } from './Icon'
import { Loader } from './Loader'
import { Colors } from './styles/colors'

interface SearchInputProps {
  onSearch: (query: string) => any
  value?: string
  width?: string | number
  autoFocus?: boolean
}

export const SearchInput: FunctionComponent<SearchInputProps> = ({
  onSearch = () => null,
  value,
  autoFocus = true,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [query, setQuery] = useState(value || '')
  const debouncedValue = useDebounce(query, 2000)
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
    <SearchIconWrapper>
      <BaseInput
        value={query}
        onChange={event => {
          setIsLoading(true)
          setQuery(event.currentTarget.value)
        }}
        ref={inputRef}
        placeholder={t('global.placeholders.search')}
        {...props}
      />

      {(isLoading && <SearchLoader />) ||
        (query && (
          <Button
            variant="outline"
            size="medium"
            onClick={() => {
              setIsLoading(true)
              setQuery('')
            }}
          >
            <Icon name={'close'} />
          </Button>
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
const SearchIconWrapper = styled.div`
  display: flex;
  position: relative;

  input {
    width: 270px;
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
    top: 10px;
    right: 5px;
  }
`
