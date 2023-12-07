import type {
  AddTenantOption,
  AddTenantsOption,
  CredentialConfig,
  EnableJobsOption,
  GithubSecretConfig,
  JobMatrixConfigs,
  JobMatrixOption,
  ScopeConfigBase,
} from './types';
import { Scope, Tenant, resolveScopeForResourceName } from './scope';
import { setOutput } from '../github-actions';
import omit from 'lodash.omit';
import { isWorkflowDevelopment } from '../../utils/runtime-env';
import { createResourceName } from './create-resource-info';
import { JobConfig } from './job-config';
import { jobSettings } from './job-settings';

export class JobMaxtrix<TCredential extends CredentialConfig> {
  public config: JobMatrixConfigs<TCredential> = {
    bff: [],
    facing: [],
    tunnel: [],
    realtime_msg_center: [],
    react: [],
    api: [],
    auth_gateway: [],
    background_job: [],
    db_migration: [],
    identityserver: [],
    mobile_api: [],
    service_discovery: [],
    web: [],
  };

  constructor(protected option: JobMatrixOption<TCredential>) {
    this.option.enableJobs =
      this.option.enableJobs ??
      ({
        bff: true,
        facing: true,
        tunnel: true,
        realtime_msg_center: true,
        react: true,
        api: true,
        auth_gateway: true,
        background_job: true,
        db_migration: true,
        identityserver: true,
        mobile_api: true,
        service_discovery: true,
        web: true,
      } satisfies EnableJobsOption<TCredential>);
  }

  private createDefaultResourceGroupName(scope: Scope): string {
    return createResourceName({
      name: '',
      type: 'resource_group',
      ...this.option.env,
      ...resolveScopeForResourceName(scope),
    });
  }

  /**
   * Add a config to the job matrix manually
   * @param serviceType
   * @param config
   */

  addConfig<TServiceType extends keyof JobMatrixConfigs<TCredential>>(
    serviceType: TServiceType,
    config: JobMatrixConfigs<TCredential>[TServiceType][number]
  ) {
    const configJob = this.config[serviceType];
    (configJob as any[]).push(config);
  }

  /**
   * Override the config, using id as the key.
   *
   * the id is the name of the resource, which is the same as the name of the service.
   * However, in the legacy naming convention, the name of the service is different from the name of the resource.
   *
   * Please use id to override with the new name;
   *
   * Example:
   *
   * ```ts
   *
      jobMatrix.overrideConfigById('bff', {
        id: 'twmr-bff',
        type: 'container_app',
        resource_group: 'twmr-bff-rg',
        name: 'twmr-bff',
        metadata: {
          service_principal_name: '',
          subscription_id: '',
        },
        credential: {
          type: 'key_vault',
          vault_name: 'demo-pipeline',
          secret_name: 'AZURE_CREDENTIAL_GET_KEY_VAULT',
          gh_secret_name: 'AZURE_CREDENTIAL_GET_KEY_VAULT',
        },
      });
      ```
   */

  overrideConfigById<TJobId extends keyof JobMatrixConfigs<TCredential>>(
    serviceType: TJobId,
    id: string,
    _config: Partial<JobMatrixConfigs<TCredential>[TJobId][number]>
  ) {
    // ID and Type cannot be changed
    const config = omit(_config, ['id', 'type']);
    const index = this.config[serviceType].findIndex(
      (item: JobMatrixConfigs<TCredential>[typeof serviceType][number]) => item.id === id
    );
    if (index === -1) {
      throw new Error(`Cannot find service ${serviceType} with id ${id}`);
    }
    this.config[serviceType][index] = {
      ...this.config[serviceType][index],
      ...config,
    } as unknown as JobMatrixConfigs<TCredential>[typeof serviceType][number];
  }

  /**
   * Override to any config that matches the scope and jobId
   * @param jobId
   * @param scope
   * @param config
   */
  overrideJobConfigs<TJobId extends keyof JobMatrixConfigs<TCredential>>(
    jobId: TJobId,
    scope: Scope,
    _config: Partial<JobMatrixConfigs<TCredential>[TJobId][number]>
  ) {
    // ID and Type cannot be changed
    const config = omit(_config, ['id', 'type']);
    for(const [index, item] of this.config[jobId].entries()) {
      if(item.scope === scope) {
        this.config[jobId][index] = {
          ...this.config[jobId][index],
          ...config,
        } as unknown as JobMatrixConfigs<TCredential>[typeof jobId][number];
      }
    }
  }

  addCommonScope(option: ScopeConfigBase) {
    option.resourceGroup = option.resourceGroup ?? this.createDefaultResourceGroupName('common');
    const { enableJobs } = this.option;
    if (!enableJobs) throw new Error('enableJobs is not defined');

    const jobConfig = new JobConfig(this.option);

    if (enableJobs.auth_gateway) {
      this.config.auth_gateway.push(jobConfig.generate('auth_gateway', { ...option, scope: 'common' }));
    }
    if (enableJobs.service_discovery) {
      this.config.service_discovery.push(jobConfig.generate('service_discovery', { ...option, scope: 'common' }));
    }
  }

  isValidTenant(
    except: AddTenantOption['except'],
    jobId: keyof JobMatrixConfigs<TCredential>,
    tenant: Tenant
  ): boolean {
    if (except === undefined) return true;
    for (const item of except) {
      if (item.tenant === tenant && item.job === jobId) return false;
    }
    return true;
  }

  /**
   * Add a tenant to the job matrix
   * @param option
   */
  addTenant(option: AddTenantOption) {
    option.resourceGroup = option.resourceGroup ?? this.createDefaultResourceGroupName(option.tenant);
    const { enableJobs } = this.option;
    if (!enableJobs) throw new Error('enableJobs is not defined');

    const jobConfig = new JobConfig(this.option);

    for (const jobId of Object.keys(this.config)) {
      const job = jobId as keyof JobMatrixConfigs<TCredential>;
      if (
        enableJobs[job] &&
        jobSettings[job].scopeType === 'tenant' &&
        this.isValidTenant(option.except, job, option.tenant)
      ) {
        this.addConfig(job, jobConfig.generate(job, { ...option, scope: option.tenant }));
      }
    }

    // // ----------- Main Wmgr ---------------
    // if (enableJobs.web) {
    //   this.config.web.push(jobConfig.generate('web', option));
    // }
    // if (enableJobs.mobile_api) {
    //   this.config.mobile_api.push(jobConfig.generate('mobile_api', option));
    // }
    // if (enableJobs.api) {
    //   this.config.api.push(jobConfig.generate('api', option));
    // }
    // if (enableJobs.identityserver) {
    //   this.config.identityserver.push(jobConfig.generate('identityserver', option));
    // }

    // // TODO: except contractor
    // if (enableJobs.background_job) {
    //   this.config.background_job.push(jobConfig.generate('background_job', option));
    // }
    // if (enableJobs.db_migration) {
    //   this.config.db_migration.push(jobConfig.generate('db_migration', option));
    // }

    // // --------- TechStack with React --------------

    // if (enableJobs.bff) {
    //   this.config.bff.push(jobConfig.generate('bff', option));
    // }
    // if (enableJobs.facing) {
    //   this.config.facing.push(jobConfig.generate('facing', option));
    // }
    // if (enableJobs.react) {
    //   this.config.react.push(jobConfig.generate('react', option));
    // }
    // // --------- TechStack with Realtime Module ------
    // if (enableJobs.tunnel) {
    //   this.config.tunnel.push(jobConfig.generate('tunnel', option));
    // }
    // if (enableJobs.realtime_msg_center) {
    //   this.config.realtime_msg_center.push(jobConfig.generate('realtime_msg_center', option));
    // }
  }

  /**
   * Loop through all tenants and add them to the job matrix
   * @param tenantConfig tenant config for each tenant
   * @param enableTenants enable tenants from WorkflowEnvConfig
   */

  addTenants(enableTenants: Record<Tenant, boolean>, option: AddTenantsOption) {
    for (const _key of Object.keys(enableTenants)) {
      const tenant = _key as Tenant;
      if (enableTenants[tenant]) {
        let tenantConfig = option.tenantConfig;
        if (tenantConfig === undefined && option.overrideTenantConfig === undefined) {
          throw new Error('tenantConfig or overrideTenantConfig must be provided');
        } else if (option.overrideTenantConfig !== undefined) {
          tenantConfig = option.overrideTenantConfig[tenant];
        }
        if (tenantConfig === undefined) {
          throw new Error(`tenantConfig for ${tenant} is not provided`);
        }
        this.addTenant({ tenant, ...tenantConfig, except: option.except });
      }
    }
  }

  /**
   * Get all ids from the job matrix config
   * @param config
   * @returns
   */
  static getIds<TCredential extends CredentialConfig = GithubSecretConfig>(config: JobMatrixConfigs<TCredential>) {
    const result = [];
    for (const job of Object.keys(config)) {
      result.push(...config[job as keyof JobMatrixConfigs].map(job => [job.type, job.id].join('.')));
    }
    return new Set(result);
  }

  getIds() {
    return JobMaxtrix.getIds(this.config);
  }

  /**
   * Remove unnecessary properties from the job matrix output when using in Github Actions (production env)
   *
   * In order to read all properties, setup WORKFLOW_ENV=development
   *
   * @param configs
   * @returns
   */
  static setOutput<TCredential extends CredentialConfig>(
    configs: JobMatrixConfigs<TCredential>,
    outputName: string
  ): JobMatrixConfigs<TCredential> {
    if (isWorkflowDevelopment()) {
      return setOutput(configs, outputName);
    }
    for (const [key, _] of Object.entries(configs)) {
      const config = configs[key as keyof JobMatrixConfigs<TCredential>];
      if (!Array.isArray(config)) continue;
      for (const [index, _] of config.entries()) {
        config[index] = omit(config[index], ['type', 'metadata']) as any;
      }
    }
    return setOutput(configs, outputName);
  }

  setOutput(outputName: string) {
    return JobMaxtrix.setOutput(this.config, outputName);
  }
}
