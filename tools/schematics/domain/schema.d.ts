export interface DomainSchematicSchema {
  /** Target app name (e.g., demo) */
  app: string;
  /** Domain name (e.g., products, users) */
  domain: string;
  /** Feature name (e.g., list, detail) */
  name: string;
}
