import {
  type PreviewDimensionResponseMessage,
  isPreviewDimensionResponse,
} from './PreviewDimensionResponseMessage'

const stub: PreviewDimensionResponseMessage = {
  action: 'preview-dimension',
  uid: '-preview',
  callbackId: 'test-callback-id',
}

describe('PreviewDimensionResponseMessage', function () {
  it('is a message to plugin', () => {
    expect(isPreviewDimensionResponse(stub)).toEqual(true)
  })
  describe('the action property', () => {
    it('equals "preview-dimension"', () => {
      expect(
        isPreviewDimensionResponse({
          ...stub,
          action: 'preview-dimension',
        }),
      ).toEqual(true)
      expect(
        isPreviewDimensionResponse({
          ...stub,
          action: 'something-else',
        }),
      ).toEqual(false)
    })
  })
})
