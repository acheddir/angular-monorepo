/**
 * Application configuration interface
 */
export interface Config extends Record<string, unknown> {
  apiUrl: string | undefined;
  apiPrefix: string;
}
