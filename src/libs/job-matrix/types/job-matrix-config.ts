import { CredentialConfig, GithubSecretConfig } from './credential-config';
import { ContainerAppConfig, FunctionAppConfig, ReactConfig, SqlDatabaseConfig, WebAppConfig } from './matrix-config';

/**
 * JobMatrixConfigs
 *
 * Intention for using snake case for the JobMatrixConfigs.
 */
export interface JobMatrixConfigs<TCredential extends CredentialConfig = GithubSecretConfig> {
  // --------------- Main Wmgr ---------------
  db_migration: SqlDatabaseConfig<TCredential>[];
  web: WebAppConfig<TCredential>[];
  mobile_api: WebAppConfig<TCredential>[];
  api: WebAppConfig<TCredential>[];
  identityserver: WebAppConfig<TCredential>[];
  auth_gateway: WebAppConfig<TCredential>[];
  service_discovery: FunctionAppConfig<TCredential>[];
  background_job: FunctionAppConfig<TCredential>[];

  // -------- TechStack with React --------------
  bff: ContainerAppConfig<TCredential>[];
  facing: ContainerAppConfig<TCredential>[];
  react: ReactConfig<TCredential>[];

  // -------- TechStack with Realtime Module ------
  realtime_msg_center: FunctionAppConfig<TCredential>[];
  tunnel: ContainerAppConfig<TCredential>[];
}
