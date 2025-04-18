/* eslint-disable @typescript-eslint/no-explicit-any */

export {};

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

/* eslint-enable @typescript-eslint/no-explicit-any */
