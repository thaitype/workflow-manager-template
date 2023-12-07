import { EnvironmentAttributes } from '../create-resource-info';
import { Scope, Tenant } from '../scope';
import { CredentialConfig, GithubSecretConfig } from './credential-config';
import { JobMatrixConfigs } from './job-matrix-config';

export type JobSettings<TCredential extends CredentialConfig = GithubSecretConfig> = {
  [K in keyof JobMatrixConfigs<TCredential>]: {
    scopeType: 'tenant' | 'common';
  };
};

export type EnableJobsOption<TCredential extends CredentialConfig> = {
  [K in keyof JobMatrixConfigs<TCredential>]: boolean;
};

export interface JobMatrixOption<TCredential extends CredentialConfig> {
  env: EnvironmentAttributes;
  credential: TCredential;
  /**
   * Keep it undefined to enable all jobs
   */
  enableJobs?: Partial<EnableJobsOption<TCredential>>;
}

export interface ScopeConfigBase {
  subscriptionId: string;
  resourceGroup?: string;
}

export interface AddTenantOption extends ScopeConfigBase {
  tenant: Tenant;
  /**
   * Except tenants and job in this list
   */
  except?: ExceptTenantsOption[];
}

export interface AddScopeOption extends ScopeConfigBase {
  scope: Scope;
}

export interface ExceptTenantsOption {
  tenant: Tenant;
  job: keyof JobMatrixConfigs<CredentialConfig>;
}

export interface AddTenantsOption {
  /**
   * Override the tenant config for each tenant
   */
  overrideTenantConfig?: Partial<Record<Tenant, ScopeConfigBase>>;
  /**
   * Base tenant config for all tenants
   */
  tenantConfig?: ScopeConfigBase;
  /**
   * Except tenants and job in this list
   */
  except?: ExceptTenantsOption[];
}
