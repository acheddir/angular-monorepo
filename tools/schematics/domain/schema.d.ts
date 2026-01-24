export interface DomainSchematicSchema {
  /** Target app name (e.g., app) */
  app: string;
  /** Domain name (e.g., products, users) */
  domain: string;
  /** Feature name (e.g., list, detail) */
  name: string;
  /** Add route to shell for the feature */
  routing?: boolean;
  /** Add to navigation menu for the feature */
  navigation?: boolean;
}
