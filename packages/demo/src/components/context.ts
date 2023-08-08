export type Content = number
export const parseContent = (content: unknown): Content =>
  typeof content === 'number' ? content : 0
