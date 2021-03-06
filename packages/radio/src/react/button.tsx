import Halo from '@pluralsight/ps-design-system-halo'
import Theme, { useTheme } from '@pluralsight/ps-design-system-theme'
import {
  HTMLPropsFor,
  combineFns,
  ValueOf
} from '@pluralsight/ps-design-system-util'
import { compose, css } from 'glamor'
import React, {
  FocusEvent,
  MouseEvent,
  ReactText,
  useContext,
  useState
} from 'react'

import { RadioContext } from './context'
import stylesheet from '../css'

const styles = {
  button: (disabled?: boolean) =>
    compose(
      css(stylesheet['.psds-radio-button']),
      disabled && css(stylesheet['.psds-radio-button--disabled'])
    ),
  circle: (themeName: ValueOf<typeof Theme.names>, checked: boolean) =>
    compose(
      css(stylesheet['.psds-radio-button__circle']),
      css(stylesheet[`.psds-radio-button__circle.psds-theme--${themeName}`]),
      checked && css(stylesheet['.psds-radio-button__circle--checked'])
    ),
  circleOuter: () => css(stylesheet['.psds-radio-button__circle-outer']),
  circleInner: () => css(stylesheet['.psds-radio-button__circle-inner']),
  halo: () => css(stylesheet['.psds-radio-button__halo']),
  input: () => css(stylesheet['.psds-radio-button__input']),
  label: (themeName: ValueOf<typeof Theme.names>) =>
    compose(
      css(stylesheet['.psds-radio-button__label']),
      css(stylesheet[`.psds-radio-button__label.psds-theme--${themeName}`])
    )
}

const isChecked = (a: ReactText, b?: ReactText) => a === b

export interface RadioButtonProps
  extends Omit<HTMLPropsFor<'input'>, 'onClick'> {
  label: React.ReactNode
  onBlur?: (evt: FocusEvent<HTMLInputElement>) => void
  onClick?: (evt: MouseEvent<HTMLInputElement>, val?: ReactText) => void
  onFocus?: (evt: FocusEvent<HTMLInputElement>) => void
  value: React.ReactText
}

const Button = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ value, label, ...props }, forwardedRef) => {
    const themeName = useTheme()
    const { checkedValue, onChange, disabled, error, name } = useContext(
      RadioContext
    )
    const ref = React.useRef<HTMLInputElement>(
      (null as unknown) as HTMLInputElement
    )
    React.useImperativeHandle(forwardedRef, () => ref.current)

    const [isFocused, setFocus] = useState(false)

    const handleFocus = (evt: FocusEvent<HTMLInputElement>) => {
      if (disabled) return

      combineFns(_evt => setFocus(true), props.onFocus)(evt)
    }

    const handleBlur = (evt: FocusEvent<HTMLInputElement>) => {
      if (disabled) return

      combineFns(props.onBlur, () => setFocus(false))(evt)
    }

    const handleClick = (evt: MouseEvent<HTMLInputElement>) => {
      const value = (evt.target as HTMLInputElement).value
      combineFns(onChange, props.onClick)(evt, value)
      ref.current.focus()
    }

    const checked = isChecked(value, checkedValue)
    return (
      <label {...styles.button(disabled)}>
        <div {...styles.circleOuter()}>
          <Halo
            error={error}
            inline
            shape={Halo.shapes.pill}
            visibleOnFocus={!disabled}
            visible={isFocused}
            {...styles.halo()}
          >
            <div
              role="radio"
              aria-checked={checked}
              tabIndex={-1}
              {...styles.circle(themeName, checked)}
            >
              {checked && <div {...styles.circleInner()} />}
            </div>
          </Halo>
        </div>

        <input
          {...props}
          onClick={disabled ? undefined : handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type="radio"
          readOnly
          name={name}
          ref={ref}
          value={value}
          {...styles.input()}
        />

        <div {...styles.label(themeName)}>{label}</div>
      </label>
    )
  }
)

Button.displayName = 'Radio.Button'

export default Button
