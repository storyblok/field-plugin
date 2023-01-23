declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STORYBLOK_PERSONAL_ACCESS_TOKEN?: string
    }
  }
}

export {}
