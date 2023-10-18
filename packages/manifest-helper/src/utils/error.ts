export const getErrorMessage = (err: unknown) => {
  if (err instanceof Error) return err.message

  return String(err)
}
