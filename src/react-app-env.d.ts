
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly VITE_FAL_KEY: string
  [key: string]: any
}

declare namespace NodeJS {
  interface Process{
    env: ProcessEnv
  }
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production'
    [key: string]: any
  }
}

declare var process: NodeJS.Process
