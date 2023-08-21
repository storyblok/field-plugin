export const isCloneable = (obj: unknown): boolean => {
  try {
    structuredClone(obj)
    return true
  } catch {
    return false
  }
}
