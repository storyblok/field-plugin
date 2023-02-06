/// <reference types="vite/client" />

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

// no type definition for this library
declare module 'vue-json-viewer' {
  import Vue from 'vue';
  export default Vue;
}

// no type definition for this library
declare module 'vue-draggable-resizable' {
  import Vue from 'vue';
  export default Vue;
}

declare const __DEV_PLAYGROUND__: boolean;
declare const __DEV_OVERRIDE_NAME__: string | undefined;
