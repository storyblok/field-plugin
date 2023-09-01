const random8 = () =>
  Math.random()
    .toString(16)
    .slice(2, 2 + 8)

export const getRandomUid = (): string =>
  new Array(4).fill(0).map(random8).join('-')
