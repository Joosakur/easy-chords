/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MIDI_SERVER_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
