import { recordFromFieldPluginOptions } from './recordFromFieldPluginOptions'

describe('recordFromFieldPluginOptions', () => {
  it('results in empty objects for empty arrays', () => {
    expect(recordFromFieldPluginOptions([])).toEqual({})
  })
  it('maps the "name" property to keys in the resulting object', () => {
    expect(
      recordFromFieldPluginOptions([
        {
          name: 'a-key',
          value: 'a-value',
        },
      ]),
    ).toHaveProperty('a-key')
  })
  it('maps the "value" property to values in the resulting object', () => {
    expect(
      Object.values(
        recordFromFieldPluginOptions([
          {
            name: 'a-key',
            value: 'a-value',
          },
        ]),
      ),
    ).toEqual(['a-value'])
  })
  it('creates one property for each option (with unique key)', () => {
    expect(
      recordFromFieldPluginOptions([
        {
          name: 'a',
          value: '1',
        },
        {
          name: 'b',
          value: '2',
        },
        {
          name: 'c',
          value: '3',
        },
      ]),
    ).toEqual({
      a: '1',
      b: '2',
      c: '3',
    })
  })
  test('that when two or more options have equal names, the last one is used', () => {
    expect(
      recordFromFieldPluginOptions([
        {
          name: 'a',
          value: '1',
        },
        {
          name: 'a',
          value: '2',
        },
        {
          name: 'a',
          value: '3',
        },
      ]),
    ).toEqual({
      a: '3',
    })
  })
})
