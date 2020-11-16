import DSButton from '@pluralsight/ps-design-system-button'
import { CloseIcon } from '@pluralsight/ps-design-system-icon'
import {
  HTMLPropsFor,
  RefForwardingComponent,
  RefFor,
  ValueOf
} from '@pluralsight/ps-design-system-util'
import { compose, css, StyleAttribute } from 'glamor'
import React, { createContext, useContext } from 'react'

import stylesheet from '../css'
import * as vars from '../vars'

const ColorContext = createContext<ValueOf<typeof vars.colors>>(
  vars.colors.blue
)

type StyleFn = (props: BannerProps) => StyleAttribute

const styles: { [name: string]: StyleFn } = {
  banner: ({ color }) =>
    compose(
      css(stylesheet['.psds-banner']),
      css(stylesheet[`.psds-banner--color-${color}`])
    ),
  button: ({ color }) =>
    compose(
      css(stylesheet['.psds-banner__button']),
      css(stylesheet[`.psds-banner__button--color-${color}`])
    ),
  dismiss: () => css(stylesheet['.psds-banner__dismiss']),
  text: () => css(stylesheet['.psds-banner__text'])
}

interface BannerProps extends Omit<HTMLPropsFor<'div'>, 'onClick'> {
  color?: ValueOf<typeof vars.colors>
  onClick?: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

interface BannerStatics {
  Button: typeof Button
  colors: typeof vars.colors
}

interface BannerComponent
  extends RefForwardingComponent<BannerProps, HTMLDivElement, BannerStatics> {}

const Banner = React.forwardRef((props, ref) => {
  const { color = vars.colors.blue, onClick, ...rest } = props

  return (
    <ColorContext.Provider value={color}>
      <div {...styles.banner({ color })} {...rest} ref={ref}>
        <div {...styles.text({ color })}>{props.children}</div>
        {props.onClick && (
          <button {...styles.dismiss(props)} onClick={onClick}>
            <CloseIcon />
          </button>
        )}
      </div>
    </ColorContext.Provider>
  )
}) as BannerComponent

Banner.displayName = 'Banner'

interface AnchorProps extends HTMLPropsFor<'a'> {
  href: string
}
interface ButtonProps extends HTMLPropsFor<'button'> {
  href?: undefined
}
type ButtonComponent = React.ForwardRefExoticComponent<unknown> & {
  (props: AnchorProps, ref?: RefFor<'a'>): JSX.Element
  (props: ButtonProps, ref?: RefFor<'button'>): JSX.Element
}
const Button = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  AnchorProps | ButtonProps
>((props, forwardRef) => {
  const color = useContext(ColorContext)

  return (
    <DSButton
      {...props}
      {...styles.button({ color })}
      ref={forwardRef as any}
      appearance={DSButton.appearances.stroke}
      size={DSButton.sizes.small}
    />
  )
}) as ButtonComponent

Button.displayName = 'Button'

Banner.Button = Button

Banner.colors = vars.colors
export const colors = vars.colors

export default Banner
