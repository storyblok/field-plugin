export const hasKey = <K extends string>(
  obj: unknown,
  key: K,
): obj is Record<K, unknown> =>
  typeof obj === 'object' && obj !== null && key in obj
