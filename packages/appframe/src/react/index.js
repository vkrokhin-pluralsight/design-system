import { compose, css } from 'glamor'
import polyfillFocusWithin from 'focus-within'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import PropTypes from 'prop-types'

import filterReactProps from '@pluralsight/ps-design-system-filter-react-props'

import Button from '@pluralsight/ps-design-system-button'
import Scrollable from '@pluralsight/ps-design-system-scrollable'
import Theme, { useTheme } from '@pluralsight/ps-design-system-theme'
import { isFunction, usePrevious } from '@pluralsight/ps-design-system-util'

import stylesheet from '../css/index.js'
import * as vars from '../vars/index.js'

import useBodyScrollLock from './use-body-scroll-lock.js'
import useMatchMedia from './use-match-media.js'

if (typeof window !== 'undefined') polyfillFocusWithin(document)

const styles = {
  appframe: (themeName, _props) =>
    compose(
      css(stylesheet['.psds-appframe']),
      css(stylesheet[`.psds-appframe.psds-theme--${themeName}`])
    ),

  skipBanner: () => css(stylesheet['.psds-appframe__skip-banner']),

  container: variant =>
    compose(
      css(stylesheet['.psds-appframe__container']),
      variant && css(stylesheet[`.psds-appframe__container--${variant}`])
    ),
  content: () => css(stylesheet['.psds-appframe__content']),
  sidenav: variant =>
    compose(
      css(stylesheet['.psds-appframe__sidenav']),
      variant && css(stylesheet[`.psds-appframe__sidenav--${variant}`])
    ),
  sidenavOverflowMask: () =>
    css(stylesheet['.psds-appframe__sidenav__overflow-mask']),
  sidenavInner: () => css(stylesheet['.psds-appframe__sidenav__inner']),
  topnav: () => css(stylesheet['.psds-appframe__topnav'])
}

const AppFrameContext = createContext()

const AppFrame = React.forwardRef((props, forwardedRef) => {
  const {
    children,
    onRequestSideNavClose,
    onRequestSideNavOpen,
    sidenav,
    topnav
  } = props

  const ref = React.useRef()
  useImperativeHandle(forwardedRef, () => ref.current)

  const themeName = useTheme()

  const largeMedia = useMatchMedia(`(min-width: ${vars.breakpoints.large})`)
  const xLargeMedia = useMatchMedia(`(min-width: ${vars.breakpoints.xLarge})`)
  const prevXLarge = usePrevious(xLargeMedia)

  const defaultSidenavOpen = useMemo(() => {
    const controlled = typeof props.sidenavOpen !== 'undefined'
    return controlled ? props.sidenavOpen : xLargeMedia
  }, [props.sidenavOpen, xLargeMedia])

  const [sidenavOpen, setSidenavOpen] = useState(defaultSidenavOpen)

  const closeSidenav = useCallback(() => {
    const controlled = typeof props.sidenavOpen !== 'undefined'

    if (controlled && isFunction(onRequestSideNavClose)) onRequestSideNavClose()
    else if (!controlled) setSidenavOpen(false)
  }, [props.sidenavOpen, onRequestSideNavClose])

  const openSidenav = useCallback(() => {
    const controlled = typeof props.sidenavOpen !== 'undefined'

    if (controlled && isFunction(onRequestSideNavOpen)) onRequestSideNavOpen()
    else if (!controlled) setSidenavOpen(true)
  }, [props.sidenavOpen, onRequestSideNavOpen])

  useEffect(() => {
    const enteringXLarge = (prevXLarge !== xLargeMedia) & xLargeMedia
    if (enteringXLarge) openSidenav()
  }, [prevXLarge, xLargeMedia, openSidenav])

  useEffect(() => {
    const controlled = typeof props.sidenavOpen !== 'undefined'
    const next = controlled ? props.sidenavOpen : defaultSidenavOpen

    setSidenavOpen(next)
  }, [props.sidenavOpen, defaultSidenavOpen])

  const sidenavVariant = useMemo(() => {
    const { sidenavVariants: variants } = vars

    if (!sidenav) return variants.closed

    if (sidenavOpen) {
      return xLargeMedia ? variants.open : variants.overlay
    } else {
      return largeMedia ? variants.minimized : variants.closed
    }
  }, [sidenav, sidenavOpen, largeMedia, xLargeMedia])

  const skipTargetId = 'ps-frame-skip-target'
  const skipTargetRef = useRef()

  const focusSkipTarget = useCallback(() => {
    if (!skipTargetRef.current) return

    skipTargetRef.current.focus()
  }, [])

  const contextValue = {
    closeSidenav,
    openSidenav,
    sidenavOpen,
    sidenavVariant
  }

  return (
    <AppFrameContext.Provider value={contextValue}>
      <div
        ref={ref}
        {...styles.appframe(themeName, props)}
        {...filterReactProps(props)}
      >
        <SkipBanner href={'#' + skipTargetId} />

        <TopNav>{topnav}</TopNav>

        <Container>
          {sidenav && <SideNav>{sidenav}</SideNav>}

          <main {...styles.content()}>
            <SkipTarget
              id={skipTargetId}
              onClick={focusSkipTarget}
              ref={skipTargetRef}
            />

            {children}
          </main>
        </Container>
      </div>
    </AppFrameContext.Provider>
  )
})

AppFrame.displayName = 'AppFrame'
AppFrame.defaultProps = {}

AppFrame.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  onRequestSideNavClose: PropTypes.func,
  onRequestSideNavOpen: PropTypes.func,
  sidenav: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  sidenavOpen: PropTypes.bool,
  topnav: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
}

function SkipBanner(props) {
  return (
    <Theme name={Theme.names.dark}>
      <div {...styles.skipBanner()} {...props}>
        <Button
          appearance={Button.appearances.secondary}
          size={Button.sizes.small}
          tabIndex={0}
        >
          skip to main content
        </Button>
      </div>
    </Theme>
  )
}

SkipBanner.propTypes = {
  href: PropTypes.string.isRequired
}

const SkipTarget = React.forwardRef((props, ref) => {
  return <a ref={ref} tabIndex={-1} {...props} />
})

SkipTarget.displayName = 'SkipTarget'
SkipTarget.propTypes = {
  id: PropTypes.string.isRequired
}

function Container(props) {
  const context = useContext(AppFrameContext)
  return <div {...styles.container(context.sidenavVariant)} {...props} />
}

function SideNav(props) {
  const { sidenavVariants: variants } = vars

  const { children, ...rest } = props
  const { sidenavVariant } = useContext(AppFrameContext)

  const hoverable = sidenavVariant === variants.minimized
  const [hovered, setHovered] = useState(false)

  const variant = hoverable && hovered ? variants.overlay : sidenavVariant
  const visible = variant === variants.overlay || variant === variants.open

  const ref = React.useRef()

  const lockScroll = variant === variants.overlay
  useBodyScrollLock(ref, lockScroll)

  return (
    <Theme name={Theme.names.dark}>
      <div
        ref={ref}
        {...styles.sidenav(variant)}
        {...rest}
        {...(hoverable && {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false)
        })}
      >
        <div {...styles.sidenavOverflowMask()}>
          <Scrollable {...styles.sidenavInner()}>
            {isFunction(children) ? children({ visible }) : children}
          </Scrollable>
        </div>
      </div>
    </Theme>
  )
}

SideNav.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
}
SideNav.variants = vars.sidenavVariants

function TopNav(props) {
  const { children, ...rest } = props
  const { closeSidenav, openSidenav, sidenavOpen } = useContext(AppFrameContext)

  const meta = { closeSidenav, openSidenav, sidenavOpen }

  return (
    <Theme name={Theme.names.dark}>
      <div {...styles.topnav()} {...rest}>
        {isFunction(children) ? children(meta) : children}
      </div>
    </Theme>
  )
}
TopNav.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
}

AppFrame.SideNav = SideNav
AppFrame.SideNav.displayName = 'AppFrame.SideNav'

AppFrame.TopNav = TopNav
AppFrame.TopNav.displayName = 'AppFrame.TopNav'

export default AppFrame
