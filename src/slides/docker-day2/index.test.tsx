// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { Fragment } from 'react'
import { dockerDay3AfternoonSlides } from './index'

afterEach(() => {
  cleanup()
})

describe('docker day 2 slide rendering', () => {
  it('renders grouped summary labels only once on intro slides', () => {
    const slide = dockerDay3AfternoonSlides.find((candidate) => (
      candidate.section === '第4小時｜Dockerfile 進階與最佳化'
      && candidate.title === '開場與前情提要'
    ))

    expect(slide?.content).toBeTruthy()

    render(<Fragment>{slide?.content}</Fragment>)

    expect(screen.getAllByText('本堂課（Dockerfile 三部曲第二堂）')).toHaveLength(1)
    expect(screen.getByText('.dockerignore')).toBeTruthy()
    expect(screen.getByText('Dockerfile Best Practices（六條黃金法則）')).toBeTruthy()
    expect(screen.getByText('Multi-stage Build（重頭戲）')).toBeTruthy()
    expect(screen.queryByText('本堂課（Dockerfile 三部曲第二堂）：.dockerignore')).toBeNull()
  })
})
