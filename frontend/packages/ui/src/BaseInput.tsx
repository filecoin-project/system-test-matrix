import classNames from 'classnames'
import React, {
  forwardRef,
  FunctionComponent,
  HTMLProps,
  useState,
} from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { Icon, IconNamesType } from './Icon'
import { Colors } from './styles/colors'
import { Fonts } from './styles/fonts'

/**
 * BaseInput props.
 */
export interface Props extends HTMLProps<HTMLInputElement> {
  /**
   * Status error or success will paint input border to red or green respectively
   * It should be set together with <ErrorMessage> or <SuccessMessage> provided as children
   */
  status?: 'success' | 'error' | undefined
  /**
   * Sets icon at the begining of input field
   */
  iconBefore?: IconNamesType
  /**
   * Sets icon at the end of input field
   */
  iconAfter?: IconNamesType
  /**
   * Input info that will appear below the input field
   */
  info?: string
  /**
   * When this function is provided clear button will apper,
   * and clicking on the button will clear input value
   */
  onClearInput?: () => void | null
}

export const BaseInput: FunctionComponent<Props> = forwardRef(
  (
    {
      id = uuidv4(),
      type = 'text',
      className = '',
      placeholder = '',
      disabled = false,
      iconBefore,
      iconAfter,
      info = '',
      onBlur = () => null,
      onFocus = () => null,
      onClearInput = null,
      ...props
    }: Props,
    ref,
  ) => {
    const [fieldState, setFieldState] = useState(
      !!props.value || props.value === 0,
    )

    const [fieldType, setFieldType] = useState(type)

    const onBlurHandle = e => {
      e.target.placeholder = placeholder
      e.currentTarget.value === '' && setFieldState(false)
      onBlur(e)
    }

    const onFocusHandle = e => {
      e.target.placeholder = ''
      setFieldState(true)
      onFocus(e)
    }

    const stateClass = fieldState ? `state--active` : ''

    return (
      <Wrapper>
        <InnerWrapper
          className={classNames(
            className && className,
            disabled && 'disabled',
            props.status && props.status,
          )}
          hasIconBefore={!!iconBefore}
        >
          <input
            ref={ref}
            id={id}
            type={fieldType}
            onBlur={onBlurHandle}
            onFocus={onFocusHandle}
            {...props}
            disabled={disabled}
            autoComplete="new-password"
            value={props.value}
            placeholder={placeholder}
          />

          <fieldset
            className={classNames(
              stateClass && stateClass,
              disabled && 'disabled',
            )}
          >
            {!!iconBefore && (
              <IconBeforeWrapper>
                <Icon name={iconBefore} />
              </IconBeforeWrapper>
            )}
            {!!iconAfter && type !== 'password' && (
              <IconAfterWrapper>
                <Icon name={iconAfter} />
              </IconAfterWrapper>
            )}
            {!!onClearInput && type !== 'password' && !disabled && props.value && (
              <ClearButtonWrapper
                onClick={() => {
                  onClearInput()
                  setFieldState(false)
                }}
                hasIconAfter={!!iconAfter}
              >
                <Icon name="close" />
              </ClearButtonWrapper>
            )}
            {type === 'password' && (
              <PeekPasswordButtonWrapper
                onClick={() =>
                  setFieldType(fieldType === 'password' ? 'text' : 'password')
                }
              >
                <Icon name={fieldType === 'password' ? 'eye' : 'eye_closed'} />
              </PeekPasswordButtonWrapper>
            )}
          </fieldset>
        </InnerWrapper>

        {info && <Info status={props.status}>{info}</Info>}
      </Wrapper>
    )
  },
)

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  font-family: ${Fonts.OpenSans};
`

const InnerWrapper = styled.div<{ hasIconBefore: boolean }>`
  fieldset {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    padding: 0 0.5rem;
    border: 1px solid ${Colors.inputBorder};
    border-radius: 5px;
    overflow: hidden;
    transition: border-color 250ms;
    letter-spacing: 0.2px;
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 2.875rem;
    background: ${Colors.inputBackground};
    border: 0;
    border-radius: 5px;
    outline: none;
    font-size: 1rem;
    letter-spacing: 0.2px;
    text-indent: ${({ hasIconBefore }) => (hasIconBefore ? 2.5 : 0)}rem;
    color: ${Colors.inputText};

    &:hover + fieldset:not(.disabled) {
      border-color: ${Colors.borderHover};
    }

    ::placeholder {
      color: ${Colors.grey};
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
      margin: 0;
    }

    &:-webkit-autofill {
      box-shadow: 0 0 0 1000px white inset;
      transition: background-color 5000s ease-in-out 0s;
    }

    &[type='number'] {
      appearance: textfield;
    }
  }

  &.error.error.error {
    fieldset {
      border-color: ${Colors.inputErrorBorder};
    }
  }

  &.success.success.success {
    fieldset {
      border-color: ${Colors.inputSuccessBorder};
    }
  }

  &.disabled {
    opacity: 0.5;
  }
`

const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  margin: auto 0;
  pointer-events: none;
`

const IconBeforeWrapper = styled(IconWrapper)``

const IconAfterWrapper = styled(IconWrapper)`
  right: 1rem;
`

const PeekPasswordButtonWrapper = styled(IconWrapper)`
  right: 1rem;
  pointer-events: all;
  cursor: pointer;
`

const ClearButtonWrapper = styled(IconWrapper)<{ hasIconAfter: boolean }>`
  right: ${({ hasIconAfter }) => (hasIconAfter ? 3 : 1)}rem;
  pointer-events: all;
  cursor: pointer;
`

const Info = styled.span<{ status?: 'error' | 'success' | undefined }>`
  position: absolute;
  bottom: -1.25rem;
  max-width: 100%;
  overflow: hidden;
  padding: 0 1rem;
  font-size: 0.75rem;
  color: ${({ status }) => {
    return status
      ? status === 'error'
        ? Colors.red80
        : Colors.green80
      : Colors.borderHover
  }};
  letter-spacing: 0.1px;
  user-select: none;
  white-space: pre;
  text-overflow: ellipsis;
`
