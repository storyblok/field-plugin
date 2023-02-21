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
      ).toBeTruthy()
      expect(
        isFieldPluginOption({
          value: 'a',
        }),
      ).toBeFalsy()
    })
    test('that the "name" property is a string', () => {
      expect(
        isFieldPluginOption({
          name: 'a',
          value: 'a',
        }),
      ).toBeTruthy()
      expect(
        isFieldPluginOption({
          name: undefined,
          value: 'a',
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginOption({
          name: null,
          value: 'a',
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginOption({
          name: 123,
          value: 'a',
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginOption({
          name: true,
          value: 'a',
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginOption({
          name: [],
          value: 'a',
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginOption({
          name: {},
          value: 'a',
        }),
      ).toBeFalsy()
    })
    test('that the "value" property is required', () => {
      expect(
        isFieldPluginOption({
          name: 'a',
          value: 'a',
        }),
      ).toBeTruthy()
      expect(
        isFieldPluginOption({
          name: 'a',
        }),
      ).toBeFalsy()
    })
    test('that the "value" property is a string', () => {
      expect(
        isFieldPluginOption({
          name: 'a',
          value: 'a',
        }),
      ).toBeTruthy()
      expect(
        isFieldPluginOption({
          name: 'a',
          value: undefined,
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginOption({
          name: 'a',
          value: null,
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginOption({
          name: 'a',
          value: 123,
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginOption({
          name: 'a',
          value: true,
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginOption({
          name: 'a',
          value: [],
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginOption({
          name: 'a',
          value: {},
        }),
      ).toBeFalsy()
    })
  })
  describe('field plugin option', () => {
    test('that the "field_type" property is required', () => {
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: [],
        }),
      ).toBeTruthy()
      expect(
        isFieldPluginSchema({
          options: [],
        }),
      ).toBeFalsy()
    })
    test('that the "field_type" property is a string', () => {
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: [],
        }),
      ).toBeTruthy()
      expect(
        isFieldPluginSchema({
          field_type: undefined,
          options: [],
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginSchema({
          field_type: null,
          options: [],
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginSchema({
          field_type: 123,
          options: [],
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginSchema({
          field_type: true,
          options: [],
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginSchema({
          field_type: {},
          options: [],
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginSchema({
          field_type: [],
          options: [],
        }),
      ).toBeFalsy()
    })
    test('that the "options" property is required', () => {
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: [],
        }),
      ).toBeTruthy()
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
        }),
      ).toBeFalsy()
    })
    test('that the "options" property is an array', () => {
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: [],
        }),
      ).toBeTruthy()
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: undefined,
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: null,
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: {},
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: 'a',
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: 123,
        }),
      ).toBeFalsy()
      expect(
        isFieldPluginSchema({
          field_type: 'field-type-name',
          options: true,
        }),
      ).toBeFalsy()
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
        }),
      ).toBeTruthy()
      expect(
        isFieldPluginSchema({
          field_type: 'name',
          options: [{}],
        }),
      ).toBeFalsy()
    })
  })
})
