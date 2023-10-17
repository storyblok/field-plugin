// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (err: any) => {
  if (err instanceof Error) return err.message

  return String(err)
}
