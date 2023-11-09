export const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message

  return String(err)
}
