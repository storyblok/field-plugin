import { toRaw, isProxy, isRef, unref } from 'vue'

export function convertToRaw(object: any) {
  if (!isObject(object)) {
    return object
  }

  let rawObject = object
  if (isProxy(rawObject)) {
    rawObject = toRaw(rawObject)
  }
  if (isRef(rawObject)) {
    rawObject = unref(rawObject)
  }

  if (!isObject(rawObject)) {
    return rawObject
  }

  return Object.keys(rawObject).reduce((result, key) => {
    result[key] = convertToRaw(rawObject[key])
    return result
  }, rawObject)
}

function isObject(value: unknown) {
  return Object.prototype.toString.call(value) === '[object Object]'
}
