// TODO: remove / simplify
import {
  filterItems,
  findSingle,
  relativePosition,
  scrollInView,
} from '@filecoin/core'
import { find } from 'lodash'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Button } from '../Button'
import { Icon } from '../Icon'
import { Loader } from '../Loader'
import { SearchInput } from '../SearchInput'
import { Colors } from '../styles/colors'
import { Text } from '../Text'

import { DropdownItem } from './DropdownItem'

interface Option {
  label: string
  value: string
  disabled?: boolean
}

/**
 * Possible values for `size` prop of `Dropdown` component.
 */
export const DropdownSizes = ['large', 'medium'] as const
export type DropdownSizes = typeof DropdownSizes[number]

/**
 * Possible values for `status` prop of `Dropdown` component.
 * Status error or success will paint input border to red, green or gray
 */
export const DropdownStatus = ['success', 'error'] as const
export type DropdownStatus = typeof DropdownStatus[number]

interface Props {
  /**
   * Seletc item options
   */
  options: Option[]
  /**
   * Input value
   */
  value: any
  /**
   * On input change
   */
  onChange: Function
  /**
   * Disabled field
   */
  disabled?: boolean

  /**
   * Placeholder
   */
  placeholder?: string
  /**
   * Text that appears below the select input field
   */
  info?: string
  /**
   * Input size
   */
  size?: DropdownSizes
  /**
   * Status error or success will paint input border and info text to red or green
   */
  status?: DropdownStatus
  /**
   * Can select multiple options
   */
  multiple?: boolean | string
  /**
   * Show option value with label - label (value)
   */
  displayValue?: boolean
  required?: boolean
  scrollHeight?: number
  name?: string
  isFilter?: boolean
  searchable?: boolean

  isLoading?: boolean
  onApplyFilter?: Function
  onClearFilter?: Function
  className?: string
  type?: string
  id?: string
  field?: any
  form?: any
  tabIndex?: number
}

export const Dropdown: FunctionComponent<Props> = ({
  size = 'medium',
  ...props
}) => {
  const myRef = useRef(null)
  const nativeSelect = useRef(null)
  const contentRef = useRef(null)
  const containerRef = useRef(null)
  const [showField, setShow] = useState(false)
  const [searchedItems, setSearchedItems]: any = useState(props.options)
  const [multipleIndex, setMultipleIndex] = useState(-1)
  const { t } = useTranslation()

  const scrollToElement = option => {
    if (showField) {
      const selectedValue = option
        ? option.label
        : (nativeSelect.current.options[1] &&
            nativeSelect.current.options[1].text) ||
          null
      if (selectedValue) {
        const highlightItem = findSingle(
          contentRef.current,
          `li[label='${selectedValue}']`,
        )
        if (highlightItem) {
          scrollInView(contentRef.current, highlightItem)
        }
      }
    }
  }

  useEffect(() => {
    if (myRef.current) {
      if (showField) {
        myRef.current.style.opacity = 0
        myRef.current.style.display = 'block'

        let last = +new Date()
        let opacity = 0
        const tick = () => {
          opacity =
            +myRef.current.style.opacity + (new Date().getTime() - last) / 250
          myRef.current.style.opacity = opacity
          last = +new Date()

          if (+opacity < 1) {
            return (
              (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
              setTimeout(tick, 16)
            )
          }
        }

        tick()

        scrollToElement(false)
        myRef.current.style.transform = 'translateY(0)'
      } else {
        myRef.current.style.display = 'none'
        myRef.current.style.transform = ''
      }
    }
  }, [showField])

  useEffect(() => {
    if (nativeSelect.current) {
      nativeSelect.current.selectedIndex = 1
    }
  }, [nativeSelect])

  const remove = (e, force = false): any => {
    if (myRef.current && myRef.current.contains(e.target) && !force) {
      return
    }
    document.removeEventListener('mouseup', remove, false)
    setShow(false)
  }

  const show = () => {
    if (!showField) {
      setTimeout(() => {
        document.addEventListener('mouseup', remove, false)
        setShow(true)
        relativePosition(myRef.current, containerRef.current)
        if (containerRef.current) {
          containerRef.current.focus()
        }
      }, 100)
    }
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', remove, false)
    }
  }, [])

  useEffect(() => {
    setSearchedItems(props.options)
  }, [props.options])

  const findSelectionIndex = value => {
    let index = -1
    if (props.value && Array.isArray(props.value)) {
      for (let i = 0; i < props.value.length; i++) {
        if (props.value[i] == value) {
          index = i
          break
        }
      }
    }
    return index
  }

  const findOptionIndex = value => {
    let index = -1
    if (props.options && !props.multiple) {
      for (let i = 0; i < props.options.length; i++) {
        const optionValue = props.options[i].value
        if ((value === null && optionValue == null) || value == optionValue) {
          index = i
          break
        }
      }
    }
    if (props.multiple) {
      return findSelectionIndex(value)
    }
    return index
  }

  const findOption = value => {
    const index = findOptionIndex(value)
    return index !== -1 ? props.options[index] : null
  }

  const selectItem = event => {
    const currentSelectedOption = findOption(props.value)
    const optionValue = event.option.value
    const selectionIndex = findSelectionIndex(optionValue)
    let newValue
    if (selectionIndex !== -1 && Array.isArray(props.value)) {
      newValue = props.value.filter((val, i) => i !== selectionIndex)
    } else {
      newValue = [...(props.value || []), optionValue]
    }

    if (currentSelectedOption !== event.option || props.multiple) {
      props.onChange({
        originalEvent: event.originalEvent,
        value: props.multiple ? newValue : optionValue,
        target: {
          name: props.name || (props.field && props.field.name),
          value: optionValue,
          type: props.type,
          id: props.id,
        },
      })
    }
  }

  const onOptionClick = event => {
    const option = event.option

    if (!option.disabled) {
      selectItem(event)
      if (!props.multiple) {
        remove(event, true)
      }
    }
  }

  const findNextVisibleItem = index => {
    const i = index + 1
    if (i === props.options.length) {
      return null
    }

    const option = props.options[i]

    if (option.disabled) {
      return findNextVisibleItem(i)
    }
    setMultipleIndex(i)
    return option
  }

  const onDownKey = event => {
    if (props.options) {
      if (!showField && event.altKey) {
        show()
      } else {
        const selectedItemIndex = findOptionIndex(props.value)
        const nextItem = findNextVisibleItem(
          props.multiple ? multipleIndex : selectedItemIndex,
        )
        if (nextItem) {
          selectItem({
            originalEvent: event,
            option: nextItem,
          })
          scrollToElement(nextItem)
        }
      }
    }
    event.preventDefault()
  }

  const findPrevVisibleItem = index => {
    const i = index - 1
    if (i === -1) {
      return null
    }

    const option = props.options[i]

    if (option && option.disabled) {
      return findPrevVisibleItem(i)
    }
    scrollToElement(option)
    setMultipleIndex(i)
    return option
  }

  const onUpKey = event => {
    if (props.options) {
      const selectedItemIndex = findOptionIndex(props.value)
      const prevItem = findPrevVisibleItem(
        props.multiple ? multipleIndex : selectedItemIndex,
      )
      if (prevItem) {
        selectItem({
          originalEvent: event,
          option: prevItem,
        })
      }
    }

    event.preventDefault()
  }

  const onInputKeyDown = event => {
    switch (event.which) {
      //down
      case 40:
        onDownKey(event)
        break

      //up
      case 38:
        onUpKey(event)
        break

      //space
      case 32:
        show()
        event.preventDefault()
        break

      //enter
      case 13:
        remove(event, true)
        event.preventDefault()
        break

      default:
        break
    }
  }

  const renderLabel = label => {
    let filterLabel = label
    if (props.multiple && Array.isArray(props.value) && !props.isFilter) {
      if (props.value.length > 1) {
        filterLabel = `${props.value.length} ${
          typeof props.multiple === 'string' ? props.multiple : 'Items'
        } selected`
      } else if (props.value.length === 1) {
        filterLabel = find(
          props.options,
          option => option.value === props.value[0],
        )?.label
      }
    }
    if (props.isFilter) {
      let filterLabel = label
      if (props.multiple && Array.isArray(props.value)) {
        filterLabel = props.value.join('')
      }
      return (
        <FilterButton
          variant="outline"
          size="medium"
          tabIndex={-1}
          value={filterLabel}
        >
          {(!props.multiple && label) || props.placeholder || t('global.empty')}
        </FilterButton>
      )
    } else {
      return (
        <LabelSelect>
          {filterLabel || props.placeholder || t('global.empty')}
        </LabelSelect>
      )
    }
  }

  const renderHiddenSelect = selectedOption => {
    const placeHolderOption = (
      <option value="">
        <Text type="text m" bold color="gray70">
          {props.placeholder}
        </Text>
      </option>
    )
    const option = selectedOption ? (
      <option value={selectedOption.value}>{selectedOption.label}</option>
    ) : null

    return (
      <select
        ref={nativeSelect}
        required={props.required}
        name={props.name}
        tabIndex={-1}
        multiple={Boolean(props.multiple)}
      >
        {placeHolderOption}
        {option}
      </select>
    )
  }

  const isSelected = option => {
    return findSelectionIndex(option.value) !== -1
  }

  const renderItems = (selectedOption: Option, items: Option[]) => {
    if (items) {
      return items.map((option: Option, index) => {
        return (
          <DropdownItem
            key={option.label}
            label={
              props.displayValue
                ? `${option.label} (${option.value})`
                : option.label
            }
            option={option}
            selected={
              props.multiple ? isSelected(option) : selectedOption === option
            }
            disabled={option.disabled}
            onClick={e => {
              if (props.multiple) {
                setMultipleIndex(index)
              }
              onOptionClick(e)
            }}
            hasCheckbox={props.multiple}
          />
        )
      })
    } else {
      return null
    }
  }

  const RenderToggler = () => {
    //TODO disabled,
    const selectedOption = findOption(props.value)
    const hiddenSelect = renderHiddenSelect(selectedOption)
    const label = selectedOption ? selectedOption.label : null
    const labelElement = renderLabel(label)

    return (
      <SelectWrapper
        active={!!props.value}
        isFilter={props.isFilter}
        size={size}
      >
        <HiddenWrapper>{hiddenSelect}</HiddenWrapper>
        {labelElement}
        {props.value ? (
          <Icon
            name="close"
            size="medium"
            overflow="visible"
            onClick={() => props.onClearFilter()}
          />
        ) : (
          <Icon name="arrow_up_and_down" size="xsmall" overflow="visible" />
        )}
      </SelectWrapper>
    )
  }

  const RenderField = () => {
    const selectedOption = findOption(props.value)
    const items = renderItems(selectedOption, searchedItems)

    return <DropdownList>{items}</DropdownList>
  }

  return (
    <Wrapper
      tabIndex={props.tabIndex || 0}
      onKeyUp={onInputKeyDown}
      ref={containerRef}
      data-element="dropdown"
      disabled={props.disabled}
      isFilter={props.isFilter}
      className={props.className}
      status={props.status}
      showField={showField}
      isFilled={Boolean(props.value)}
    >
      {React.cloneElement(
        <div>
          <RenderToggler />
        </div>,
        {
          onMouseUp: () => show(),
        },
      )}
      {React.cloneElement(
        <Element status={props.status} isFilled={Boolean(props.value)}>
          {props.searchable && (
            <SearchWrapper>
              <SearchInput
                width={'100%'}
                onSearch={value =>
                  setSearchedItems(filterItems(props.options, value, 'label'))
                }
              />
            </SearchWrapper>
          )}
          {React.cloneElement(
            <Content scrollHeight={props.scrollHeight}>
              {props.isLoading ? <DropdownLoader /> : <RenderField />}
            </Content>,
            {
              ref: node => (contentRef.current = node),
            },
          )}
          {props.isFilter &&
            props.multiple &&
            props.searchable &&
            props.onApplyFilter &&
            props.onClearFilter && (
              <ApplyFilterWrapper>
                <ApplyFilter
                  variant="outline"
                  size="medium"
                  onClick={e => {
                    props.onApplyFilter()
                    remove(e, true)
                  }}
                >
                  {t('orioly.dashboard.list.activityFilter.apply')}
                </ApplyFilter>
                <CancelFilter
                  variant="outline"
                  size="medium"
                  onClick={e => {
                    props.onClearFilter()
                    remove(e, true)
                  }}
                >
                  {t('global.clear')}
                </CancelFilter>
              </ApplyFilterWrapper>
            )}
        </Element>,
        {
          ref: node => (myRef.current = node),
        },
      )}
      {props.info && <Info status={props.status}>{props.info}</Info>}
    </Wrapper>
  )
}

export const dropdownClasses = {
  fullWidth: 'dropdown--full',
}

const defineStatusColor = (status: DropdownStatus) => {
  if (status === 'success') {
    return Colors.green80
  } else if (status === 'error') {
    return Colors.red80
  }
  return Colors.inputBorder
}
const Info = styled.span<{ status?: DropdownStatus }>`
  position: absolute;
  bottom: -1.25rem;
  max-width: 100%;
  overflow: hidden;
  padding: 0 1rem;
  font-size: 0.75rem;
  color: ${props => defineStatusColor(props.status)};
  letter-spacing: 0.1px;
  user-select: none;
  white-space: pre;
  text-overflow: ellipsis;
`

const DropdownList = styled.ul`
  padding: 0;
  border: 0;
  margin: 0;
  list-style-type: none;
`

const SearchWrapper = styled.div`
  padding: 0.75rem;
  padding-bottom: 0;
`

const ApplyFilterWrapper = styled.div`
  padding: 0.75rem 1.5rem;
  display: flex;
  background: ${Colors.chartTitleBackground};
`

const ApplyFilter = styled(Button)`
  font-size: 1rem;
  margin-right: 1rem;
  min-width: 4.75rem;
`

const CancelFilter = styled(ApplyFilter)`
  color: ${Colors.grey};

  &:hover {
    color: ${Colors.textColor};
  }
`

const Wrapper = styled.div<{
  disabled: boolean
  isFilter: boolean
  status?: DropdownStatus
  showField?: boolean
  isFilled: boolean
}>`
  position: relative;
  display: inline-block;
  outline: 0;
  border: ${({ status }) => {
    return `1px solid ${defineStatusColor(status)}`
  }};
  border: ${({ isFilled }) => isFilled && `1px solid ${Colors.gray60}`};
  ${({ isFilter = false }) => {
    return isFilter
      ? ''
      : `
  background: #fff;
  border-radius: 5px;
  width: 100%;
  font-size: 1rem;
  cursor: pointer;
  
  label {
    cursor: pointer;
  }
  `
  }}

  &:hover {
    border: 1px solid ${Colors.gray60};
  }

  &:focus {
    border: 1px solid ${Colors.gray60};
    border-radius: 5px;
  }

  ${({ disabled }): any => {
    return `${
      disabled
        ? `
        pointer-events: none;
        opacity: 0.5`
        : ''
    }`
  }}

  &.${dropdownClasses.fullWidth} {
    width: 100%;
  }

  ${({ status }) => {
    return (
      status &&
      `
    &,
    &:hover, 
    &:focus {
      border: 1px solid ${defineStatusColor(status)};
    };`
    )
  }}
`

const LabelSelect = styled.span`
  width: 100%;
  min-width: 100%;
  flex: 1 1 100%;
  white-space: nowrap;
  overflow: hidden;
  color: ${Colors.textGray};
`

const SelectWrapper = styled.div<{
  isFilter: boolean
  active: boolean
  size?: DropdownSizes
}>`
  height: ${({ size }) => {
    return size === 'large' ? '3.5rem' : '2.875rem'
  }};
  ${props => {
    return props.isFilter
      ? `
      display: inline-block;
    
      i {
        display: none;
      }
    `
      : `
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 3rem 0 1rem;

      i {
        position: absolute;
        right: 1rem;
      }
  `
  }}
  ${props => props.active && `color: ${Colors.textColor};`}
`

const HiddenWrapper = styled.div`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
`

const Element = styled.div<{
  status?: DropdownStatus
  isFilled: boolean
}>`
  margin-top: -8px;
  margin-left: -1px;
  box-sizing: content-box;
  padding-top: 8px;
  width: 100%;
  position: absolute;
  z-index: 3;
  border: ${({ status }) => {
    return status
      ? `1px solid ${defineStatusColor(status)}`
      : `1px solid ${Colors.gray60}`
  }};
  border: ${({ isFilled }) => isFilled && `1px solid ${Colors.gray60}`};
  border-top: none;
  border-radius: 0 0 5px 5px;
  box-shadow: 0 16px 24px rgb(20 20 43 12%);
  background-color: #fff;
`

const Content = styled.div<{
  scrollHeight?: number
}>`
  color: ${Colors.grey};
  padding: 0.5rem;
  white-space: nowrap;
  min-width: 100%;
  max-height: 200px;
  overflow: auto;
  ${props =>
    `${props.scrollHeight ? `max-height: ${props.scrollHeight || ''}px` : ''}`}
`

const FilterButton = styled(Button)`
  text-transform: uppercase;
`

const DropdownLoader = styled(Loader)`
  width: 2rem;
  height: 2rem;
  border: 4px solid rgb(255 255 255 60%);
  border-left-color: ${Colors.darkBlue};
  margin: 0 auto;
`
