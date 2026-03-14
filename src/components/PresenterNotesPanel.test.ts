// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import {
  buildPresenterNoteBlocks,
  getPresenterNotesMetrics,
} from './PresenterNotesPanel'
import PresenterNotesPanel from './PresenterNotesPanel'

afterEach(() => {
  cleanup()
})

describe('PresenterNotesPanel helpers', () => {
  it('builds intro, point, and outro cards from multi-paragraph notes', () => {
    const notes = [
      '先說明這一頁的主軸，讓講者先把方向講清楚。',
      '第二段補充背景脈絡，讓聽眾知道為什麼這件事重要。',
      '最後收斂成下一頁的轉場，提醒講者往後帶。',
    ].join('\n\n')

    expect(buildPresenterNoteBlocks(notes)).toEqual([
      {
        kind: 'intro',
        label: 'Main Thread',
        title: '先說明這一頁的主軸，讓講者先把方向講清楚。',
        body: '',
      },
      {
        kind: 'point',
        label: 'Key Point 1',
        title: '第二段補充背景脈絡，讓聽眾知道為什麼這件事重要。',
        body: '',
      },
      {
        kind: 'outro',
        label: 'Wrap-up / Transition',
        title: '最後收斂成下一頁的轉場，提醒講者往後帶。',
        body: '',
      },
    ])
  })

  it('chunks a single long paragraph into multiple cards using chinese sentence boundaries', () => {
    const notes = '先講這一頁最重要的主軸。再補一個實際例子讓講者更好帶。最後提醒下一頁會接到什麼主題。'

    expect(buildPresenterNoteBlocks(notes)).toEqual([
      {
        kind: 'intro',
        label: 'Main Thread',
        title: '先講這一頁最重要的主軸。',
        body: '再補一個實際例子讓講者更好帶。',
      },
      {
        kind: 'outro',
        label: 'Wrap-up / Transition',
        title: '最後提醒下一頁會接到什麼主題。',
        body: '',
      },
    ])
  })

  it('returns empty cards and zeroed metrics for empty notes', () => {
    expect(buildPresenterNoteBlocks('   \n\n')).toEqual([])
    expect(getPresenterNotesMetrics('   \n\n')).toEqual({
      characterCount: 0,
      paragraphCount: 0,
      blockCount: 0,
    })
  })

  it('counts chinese notes using characters and original paragraph boundaries', () => {
    const notes = '第一段有內容。\n\n第二段也有內容。'

    expect(getPresenterNotesMetrics(notes)).toEqual({
      characterCount: 15,
      paragraphCount: 2,
      blockCount: 2,
    })
  })

  it('shows section and slide title context in overlay mode when both are provided', () => {
    render(
      createElement(PresenterNotesPanel, {
        notes: '這是講稿。',
        variant: 'overlay',
        contextSection: '容器生命週期',
        contextTitle: '生命週期指令操作',
      }),
    )

    expect(screen.getByText('容器生命週期')).toBeTruthy()
    expect(screen.getByText('生命週期指令操作')).toBeTruthy()
  })

  it('shows only the slide title context when overlay mode has no section', () => {
    render(
      createElement(PresenterNotesPanel, {
        notes: '這是講稿。',
        variant: 'overlay',
        contextTitle: '環境確認',
      }),
    )

    expect(screen.getByText('環境確認')).toBeTruthy()
    expect(screen.queryByText('容器生命週期')).toBeNull()
  })

  it('does not render context metadata outside overlay mode', () => {
    render(
      createElement(PresenterNotesPanel, {
        notes: '這是講稿。',
        variant: 'modal',
        contextSection: '容器生命週期',
        contextTitle: '生命週期指令操作',
      }),
    )

    expect(screen.queryByText('容器生命週期')).toBeNull()
    expect(screen.queryByText('生命週期指令操作')).toBeNull()
  })
})
