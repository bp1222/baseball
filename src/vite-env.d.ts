/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_STANDINGS_API: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}