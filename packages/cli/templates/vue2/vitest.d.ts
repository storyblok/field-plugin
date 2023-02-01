/*
  // tsconfig.json
  {
    "compilerOptions": {
      "types": ["vitest/globals"]
    }
  }
  this is supposed to provide the global methods,
  but for unknown reason it didn't work.
  So the following is a workaround.
  https://github.com/testing-library/jest-dom/issues/427#issuecomment-1287150563
 */
export {};
declare global {
  const suite: typeof import('vitest')['suite'];
  const test: typeof import('vitest')['test'];
  const describe: typeof import('vitest')['describe'];
  const it: typeof import('vitest')['it'];
  const expect: typeof import('vitest')['expect'];
  const assert: typeof import('vitest')['assert'];
  const vitest: typeof import('vitest')['vitest'];
  const vi: typeof import('vitest')['vitest'];
  const beforeAll: typeof import('vitest')['beforeAll'];
  const afterAll: typeof import('vitest')['afterAll'];
  const beforeEach: typeof import('vitest')['beforeEach'];
  const afterEach: typeof import('vitest')['afterEach'];
}
