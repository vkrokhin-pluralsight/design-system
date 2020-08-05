import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'

import Button from '@pluralsight/ps-design-system-button'
import { PageWidthLayout } from '@pluralsight/ps-design-system-layout'
import * as Text from '@pluralsight/ps-design-system-text'

import AppFrame from '../index.js'
import { MockContent, SideNav, TopNav } from './shared.js'

storiesOf('AppFrame', module)
  .add('scrollable sidenav', _ => (
    <AppFrame
      topnav={<TopNav />}
      sidenav={
        <SideNav sections={[]}>
          <div style={{ border: '1px dashed red', margin: 40, height: 2000 }} />
        </SideNav>
      }
      sidenavOpen
    >
      <MockContent />
    </AppFrame>
  ))
  .add('sidenav controlled', _ => {
    function Story() {
      const [open, setOpen] = useState(false)
      const toggle = () => setOpen(!open)

      return (
        <AppFrame
          onRequestSideNavClose={() => setOpen(false)}
          onRequestSideNavOpen={() => setOpen(true)}
          topnav={<TopNav onMobileMenuClick={toggle} />}
          sidenav={({ visible }) => (
            <SideNav collapsed={!visible} hideLabels={!visible} />
          )}
          sidenavOpen={open}
        >
          <PageWidthLayout>
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 56px)'
              }}
            >
              <Button onClick={toggle}>toggle sidenav</Button>
            </div>
          </PageWidthLayout>
        </AppFrame>
      )
    }

    return <Story />
  })
  .add('sidenav uncontrolled', () => (
    <AppFrame
      topnav={({ openSidenav, closeSidenav, sidenavOpen }) => {
        const toggle = sidenavOpen ? closeSidenav : openSidenav
        return <TopNav onMobileMenuClick={toggle} />
      }}
      sidenav={({ visible }) => (
        <SideNav collapsed={!visible} hideLabels={!visible} />
      )}
    >
      <MockContent />
    </AppFrame>
  ))
  .add('short content', _ => (
    <AppFrame
      sidenav={<SideNav collapsed hideLabels />}
      sidenavOpen={false}
      topnav={<TopNav />}
    >
      <PageWidthLayout>
        <Text.P>
          Cupcake ipsum dolor sit amet. Sweet gummi bears dragée. Pie dragée
          cotton candy candy canes bear claw apple pie.
        </Text.P>
      </PageWidthLayout>
    </AppFrame>
  ))
  .add('no sidenav', _ => (
    <AppFrame topnav={<TopNav />}>
      <MockContent />
    </AppFrame>
  ))
