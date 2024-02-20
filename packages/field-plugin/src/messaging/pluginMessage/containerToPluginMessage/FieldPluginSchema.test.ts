import {
  FieldPluginOption,
  isFieldPluginOption,
  isFieldPluginSchema,
} from './FieldPluginSchema'

describe('field plugin schema', () => {
  describe('field plugin option', () => {
    test('that the "name" property is required', () => {
      expect(
        isFieldPluginOption({
          name: 'a',
          value: 'a',
        }),
      ).toEqual(true)
      expect(
        isFieldPluginOption({
          value: 'a',
        }),
      ).toEqual(false)
    })
    test('that the "name" property is a string', () => {
      expect(
        isFieldPluginOption({
          name: 'a',
          value: 'a',
        }),
      ).toEqual(true)
      expect(
        isFieldPluginOption({
          name: undefined,
          value: 'a',
        }),
      ).toEqual(false)
      expect(
        isFieldPluginOption({
          name: null,
          value: 'a',
        }),
      ).toEqual(false)
      expect(
        isFieldPluginOption({
          name: 123,
          value: 'a',
        }),
      ).toEqual(false)
      expect(
        isFieldPluginOption({
          name: true,
          value: 'a',
        }),
      ).toEqual(false)
      expect(
        isFieldPluginOption({
          name: [],
          value: 'a',
        }),
      ).toEqual(false)
      expect(
        isFieldPluginOption({
          name: {},
          value: 'a',
        }),
      ).toEqual(false)
    })
    test('that the "value" property is required', () => {
      expect(
        isFieldPluginOption({
          name: 'a',
          value: 'a',
        }),
      ).toEqual(true)
      expect(
        isFieldPluginOption({
          name: 'a',
        }),
      ).toEqual(false)
    })
    test('that the "value" property is a string', () => {
      expect(
        isFieldPluginOption({
          name: 'a',
          value: 'a',
        }),
      ).toEqual(true)
      expect(
        isFieldPluginOption({
          name: 'a',
          value: undefined,
        }),
      ).toEqual(false)
      expect(
        isFieldPluginOption({
          name: 'a',
          value: null,
        }),
      ).toEqual(false)
      expect(
        isFieldPluginOption({
          name: 'a',
          value: 123,
        }),
      ).toEqual(false)
      expect(
        isFieldPluginOption({
          name: 'a',
          value: true,
        }),
      ).toEqual(false)
      expect(
        isFieldPluginOption({
          name: 'a',
          value: [],
        }),
      ).toEqual(false)
      expect(
        isFieldPluginOption({
          name: 'a',
          value: {},
        }),
      ).toEqual(false)
    })
  })
  describe('field plugin option', () => {
    test('that the "field_type" property is required', () => {
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: [],
          translatable: false,
        }),
      ).toEqual(true)
      expect(
        isFieldPluginSchema({
          options: [],
        }),
      ).toEqual(false)
    })
    test('that the "field_type" property is a string', () => {
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: [],
          translatable: false,
        }),
      ).toEqual(true)
      expect(
        isFieldPluginSchema({
          field_type: undefined,
          options: [],
        }),
      ).toEqual(false)
      expect(
        isFieldPluginSchema({
          field_type: null,
          options: [],
        }),
      ).toEqual(false)
      expect(
        isFieldPluginSchema({
          field_type: 123,
          options: [],
        }),
      ).toEqual(false)
      expect(
        isFieldPluginSchema({
          field_type: true,
          options: [],
        }),
      ).toEqual(false)
      expect(
        isFieldPluginSchema({
          field_type: {},
          options: [],
        }),
      ).toEqual(false)
      expect(
        isFieldPluginSchema({
          field_type: [],
          options: [],
        }),
      ).toEqual(false)
    })
    test('that the "options" property is required', () => {
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: [],
          translatable: false,
        }),
      ).toEqual(true)
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
        }),
      ).toEqual(false)
    })
    test('that the "options" property is an array', () => {
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: [],
          translatable: false,
        }),
      ).toEqual(true)
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: undefined,
        }),
      ).toEqual(false)
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: null,
        }),
      ).toEqual(false)
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: {},
        }),
      ).toEqual(false)
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: 'a',
        }),
      ).toEqual(false)
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: 123,
        }),
      ).toEqual(false)
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: true,
        }),
      ).toEqual(false)
    })
    test('that the "options" property is an array of FieldPluginOptions', () => {
      const option: FieldPluginOption = {
        name: 'a',
        value: 'b',
      }
      expect(
        isFieldPluginSchema({
          field_type: 'name',
          options: [option],
          translatable: false,
        }),
      ).toEqual(true)
      expect(
        isFieldPluginSchema({
          field_type: 'name',
          options: [{}],
        }),
      ).toEqual(false)
    })
  })
})
