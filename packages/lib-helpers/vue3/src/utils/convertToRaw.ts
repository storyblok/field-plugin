import { isProxy, isRef, toRaw, unref } from 'vue'

//TODO: improve types

/* This is necessary in case we have nested reactive elements like Ref(Proxy(value)) to recursively unwrap until the value is neither */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawify = (value: unknown): any => {
  if (isProxy(value)) {
    const rawValue = toRaw(value)
    return rawify(rawValue)
  }
  if (isRef(value)) {
    const unrefValue = unref(value)
    return rawify(unrefValue)
  }

  return value
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToRaw(value: any): any {
  const rawValue = rawify(value)

  if (typeof rawValue === 'object' && rawValue !== null) {
    return Object.keys(rawValue).reduce((result, key) => {
      result[key] = convertToRaw(rawValue[key])
      return result
    }, rawValue)
  }

  if (Array.isArray(rawValue)) {
    return rawValue.map(convertToRaw)
  }
  return rawValue
}
