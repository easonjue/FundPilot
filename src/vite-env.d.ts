/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_NEWS_API_KEY: string
  readonly VITE_MARKET_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.module.less' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.less' {
  const content: string
  export default content
}

declare module '*.css' {
  const content: string
  export default content
}
