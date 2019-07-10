import React from 'react'
import { render } from 'react-testing-library'

import Carousel from '../index.js'
import * as vars from '../../vars/index.js'

describe('Carousel', () => {
  it('exports sizes', () => {
    expect(Carousel.sizes).toEqual(vars.sizes)
  })

  it('exports a Controls component', () => {
    expect(Carousel.Controls).toBeDefined()
  })

  it('exports a Control component', () => {
    expect(Carousel.Control).toBeDefined()
  })

  describe('with a single item', () => {
    let controls
    let pages

    beforeEach(() => {
      const { container } = render(
        <Carousel>
          <div />
        </Carousel>
      )

      controls = container.querySelectorAll(
        '[aria-label="carousel controls"] > li'
      )
      pages = container.querySelectorAll('[aria-label="carousel"] > li')
    })

    it('should NOT have controls', () => {
      expect(controls).toHaveLength(0)
    })

    it('should NOT hide the active page from screen readers', () => {
      expect(pages[0]).not.toHaveAttribute('aria-hidden')
    })
  })

  describe('with multiple items', () => {
    let controls
    let pages

    beforeEach(() => {
      const { container } = render(
        <Carousel>
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </Carousel>
      )

      controls = container.querySelectorAll(
        '[aria-label="carousel controls"] > li'
      )

      pages = container.querySelectorAll('[aria-label="carousel"] > li')
    })

    it('should split items into pages', () => {
      expect(pages).toHaveLength(6)
    })

    it('should have controls', () => {
      expect(controls.length).toBeGreaterThan(0)
    })

    it('should move the first page into view', () => {
      const firstPage = pages[0]
      expect(firstPage).toHaveStyle('transform: translate3d(0px, 0, 0);')
    })

    it('should NOT hide the active page from screen readers', () => {
      expect(pages[0]).not.toHaveAttribute('aria-hidden')
    })

    it('should hide inactive pages from screen readers', () => {
      const inactive = Array.from(pages).slice(1)

      for (const page of inactive) {
        expect(page).toHaveAttribute('aria-hidden')
        expect(page).toHaveAttribute('tabIndex', '-1')
      }
    })
  })

  describe('when on the first page', () => {
    let container

    beforeEach(() => {
      const { container: _container } = render(
        <Carousel data-testid="carousel">
          <div />
          <div />
          <div />
          <div />
          <div />
          <div />
        </Carousel>
      )
      container = _container
    })

    it('should show the next button', () => {
      const nextButton = container.querySelector('[aria-label="next"]')
      expect(nextButton).toBeDefined()
    })

    it('should NOT show the prev button', () => {
      const prevButton = container.querySelector('[aria-label="prev"]')
      expect(prevButton).toBeNull()
    })
  })

  describe('when on the last page', () => {
    it.skip('should NOT show the next button', () => {})
    it.skip('should show the prev button', () => {})
  })

  describe('when next button is clicked', () => {
    it.skip('should page foward', () => {})
  })

  describe('when prev button is clicked', () => {
    it.skip('should page backward', () => {})
  })

  describe('when the right arrow key is pressed', () => {
    it.skip('should page foward', () => {})
  })

  describe('when the left arrow key is pressed', () => {
    it.skip('should page backward', () => {})
  })
})
