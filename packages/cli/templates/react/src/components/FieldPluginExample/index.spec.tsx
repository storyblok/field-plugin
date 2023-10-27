import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'

import FieldPlugin from '.'
import { useFieldPlugin } from '@storyblok/field-plugin/react'
import { FieldPluginResponse } from '@storyblok/field-plugin'

vi.mock('@storyblok/field-plugin/react')

const fieldPluginDefault: FieldPluginResponse<number | undefined> = {
  type: 'loaded',
  data: {
    isModalOpen: false,
    content: undefined,
    options: {},
    spaceId: undefined,
    storyLang: '',
    story: {
      content: {},
    },
    storyId: undefined,
    blockUid: undefined,
    token: undefined,
    uid: '',
  },
  actions: {
    setContent: vi.fn(),
    setModalOpen: vi.fn(),
    requestContext: vi.fn(),
    selectAsset: vi.fn(),
  },
}

describe('FieldPluginExammple', () => {
  test('should work', () => {
    vi.mocked(useFieldPlugin<number | undefined>).mockReturnValue(
      fieldPluginDefault,
    )
    render(<FieldPlugin />)
    const headline = screen.getByText('Field Value')
    expect(headline).toBeInTheDocument()
  })
})
