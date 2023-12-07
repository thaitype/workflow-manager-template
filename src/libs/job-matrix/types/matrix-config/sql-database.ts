import { CredentialConfig } from '../credential-config';
import { MatrixConfigBase } from './matrix-config';

export interface SqlDatabaseConfigMetadata {}

export interface SqlDatabaseConfig<TCredential extends CredentialConfig>
  extends MatrixConfigBase<'sql_database', TCredential, SqlDatabaseConfigMetadata> {
  /**
   * SQL Database Name
   */
  name: string;
  /**
   * SQL Database Server, use for Atom , Dev
   */
  server?: string;
}
