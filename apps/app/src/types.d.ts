declare namespace NodeJS {
  interface ProcessEnv extends Dict<string> {
    APP_API_URL: string;
  }
}
