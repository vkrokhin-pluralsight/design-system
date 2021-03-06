import {
  HTMLPropsFor,
  createUniversalPortal,
  useCloseOnDocumentEvents
} from '@pluralsight/ps-design-system-util'
import React, {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
  useLayoutEffect,
  useState,
  RefObject
} from 'react'
import { css, keyframes } from 'glamor'

import stylesheet from '../css'
import { DropdownContext } from '../js'

const slide = keyframes(
  stylesheet['@keyframes psds-dropdown__menu__keyframes__slide']
)

const styles = {
  menuWrapper: () => css(stylesheet['.psds-dropdown__menu-wrapper']),
  menu: () =>
    css(
      stylesheet['.psds-dropdown__menu'],
      stylesheet['.psds-dropdown__menu__animation']({ slide })
    )
}

interface DropdownMenuProps extends HTMLPropsFor<'div'> {
  inNode?: HTMLElement
  isOpen: boolean
  menu: React.ReactNode
  menuId: string
  menuPosition: { top: number; left: number; width: number }
  buttonRef: RefObject<HTMLButtonElement>
}

export const Menu = forwardRef<HTMLDivElement, DropdownMenuProps>(((
  props,
  forwardedRef
) => {
  const {
    inNode,
    isOpen,
    menu,
    menuId,
    menuPosition,
    buttonRef,
    ...rest
  } = props

  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  const [adjMenuPosition, setAdjMenuPosition] = useState<{
    left: number
    top: number
    width: number
  }>()

  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  const context = useContext(DropdownContext)
  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  const ref = useRef<HTMLDivElement>(null)
  /* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, react-hooks/rules-of-hooks */
  useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement)

  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  useCloseOnDocumentEvents<HTMLDivElement>(ref, context.onDocumentEvents)

  /* eslint-disable-next-line react-hooks/rules-of-hooks */
  useLayoutEffect(() => {
    setAdjMenuPosition(menuPosition)
    if (!isOpen || !ref.current || !buttonRef.current) return

    const menuRect = ref.current.getBoundingClientRect()
    const buttonRect = buttonRef.current.getBoundingClientRect()
    if (buttonRect.bottom + menuRect.height > window.innerHeight) {
      setAdjMenuPosition({
        ...menuPosition,
        top: buttonRect.top - menuRect.height - 8
      })
    }
  }, [ref, buttonRef, isOpen, menuPosition, setAdjMenuPosition])

  return (
    menu &&
    isOpen &&
    createUniversalPortal(
      <div {...styles.menuWrapper()} style={adjMenuPosition}>
        <div {...styles.menu()} ref={ref} role="listbox" id={menuId} {...rest}>
          {menu}
        </div>
      </div>,
      inNode
    )
  )
}) as ForwardRefRenderFunction<HTMLDivElement, DropdownMenuProps>)

Menu.displayName = 'Dropdown.Menu'
// TODO: replace
Menu.defaultProps = {
  menu: <span />
}
