import { createKeyVaultSecretName, createServicePricinpleName } from '../../utils';
import { createResourceName } from './create-resource-info';
import { resolveScopeForResourceName } from './scope';
import { AddScopeOption, CredentialConfig, JobMatrixConfigs, JobMatrixOption, ScopeConfigBase } from './types';

export class JobConfig<TCredential extends CredentialConfig> {
  constructor(protected option: JobMatrixOption<TCredential>) {}

  generate<TJobId extends keyof JobMatrixConfigs<TCredential>>(jobId: TJobId, option: AddScopeOption) {
    return this[jobId](option) as JobMatrixConfigs<TCredential>[TJobId][number];
  }

  protected parseId(id: string) {
    return id.replace(/-/g, '_');
  }

  protected getCredential(secret_name?: string): TCredential {
    const credentialType = this.option.credential.type;
    switch (credentialType) {
      case 'github_secret':
        return {
          ...this.option.credential,
          type: 'github_secret',
        };
      case 'key_vault':
        return {
          ...this.option.credential,
          secret_name,
          type: 'key_vault',
        };
      default:
        throw new Error(`Credential type ${credentialType} is not supported`);
    }
  }

  protected bff(option: AddScopeOption): JobMatrixConfigs<TCredential>['bff'][number] {
    const bffName = createResourceName({
      name: 'bff',
      type: 'container_app',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(bffName),
      type: 'container_app',
      name: bffName,
      scope: option.scope,
      resource_group: option.resourceGroup ?? '',
      metadata: {
        service_principal_name: createServicePricinpleName({
          envName: this.option.env.environment,
          scope: option.scope,
          serviceName: 'bff',
          actionName: 'container/update',
          resourceName: bffName,
          location: 'github-actions',
        }),
        subscription_id: option.subscriptionId,
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: bffName,
          resourceType: 'container_app',
          scope: option.scope,
          serviceName: 'bff',
        })
      ),
    };
  }

  /**
   * Facing Service
   */

  protected facing(option: AddScopeOption): JobMatrixConfigs<TCredential>['facing'][number] {
    const facingName = createResourceName({
      name: 'fac',
      type: 'container_app',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(facingName),
      type: 'container_app',
      name: facingName,
      scope: option.scope,
      resource_group: option.resourceGroup ?? '',
      metadata: {
        service_principal_name: createServicePricinpleName({
          envName: this.option.env.environment,
          scope: option.scope,
          serviceName: 'facing',
          actionName: 'container/update',
          resourceName: facingName,
          location: 'github-actions',
        }),
        subscription_id: option.subscriptionId,
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: facingName,
          resourceType: 'container_app',
          scope: option.scope,
          serviceName: 'facing',
        })
      ),
    };
  }
  /**
   * React App
   */
  protected react(option: AddScopeOption): JobMatrixConfigs<TCredential>['react'][number] {
    const storageAccountName = createResourceName({
      name: 'file',
      type: 'storage_account',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(storageAccountName),
      type: 'react',
      storage_account_name: storageAccountName,
      scope: option.scope,
      metadata: {
        service_principal_name: createServicePricinpleName({
          envName: this.option.env.environment,
          scope: option.scope,
          serviceName: 'react',
          actionName: 'storage/blob/upload-batch',
          resourceName: storageAccountName,
          location: 'github-actions',
        }),
        subscription_id: option.subscriptionId,
        resource_group: option.resourceGroup ?? '',
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: storageAccountName,
          resourceType: 'storage_account',
          scope: option.scope,
          serviceName: 'react',
        })
      ),
    };
  }

  /**
   * Realtime Messenger Tunnel Service
   */
  protected tunnel(option: AddScopeOption): JobMatrixConfigs<TCredential>['tunnel'][number] {
    const realtimeMsgTunnelName = createResourceName({
      name: 'tun',
      type: 'container_app',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(realtimeMsgTunnelName),
      type: 'container_app',
      name: realtimeMsgTunnelName,
      scope: option.scope,
      resource_group: option.resourceGroup ?? '',
      metadata: {
        service_principal_name: createServicePricinpleName({
          envName: this.option.env.environment,
          scope: option.scope,
          serviceName: 'tunnel',
          actionName: 'container/update',
          resourceName: realtimeMsgTunnelName,
          location: 'github-actions',
        }),
        subscription_id: option.subscriptionId,
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: realtimeMsgTunnelName,
          resourceType: 'container_app',
          scope: option.scope,
          serviceName: 'realtime_msg_tunnel',
        })
      ),
    };
  }

  /**
   * Realtime Messaging Center Service
   */
  protected realtime_msg_center(option: AddScopeOption): JobMatrixConfigs<TCredential>['realtime_msg_center'][number] {
    const realtimeMsgCenterName = createResourceName({
      name: 'rt-msg',
      type: 'function_app',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(realtimeMsgCenterName),
      type: 'function_app',
      name: realtimeMsgCenterName,
      scope: option.scope,
      resource_group: option.resourceGroup ?? '',
      slot_name: 'production',
      metadata: {
        subscription_id: option.subscriptionId,
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: realtimeMsgCenterName,
          resourceType: 'container_app',
          scope: option.scope,
          serviceName: 'realtime_msg_center',
        })
      ),
    };
  }

  protected web(option: AddScopeOption): JobMatrixConfigs<TCredential>['web'][number] {
    const webName = createResourceName({
      name: '',
      type: 'app_service',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(webName),
      type: 'web_app',
      name: webName,
      scope: option.scope,
      slot_name: 'production',
      resource_group: option.resourceGroup ?? '',
      metadata: {
        subscription_id: option.subscriptionId,
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: webName,
          resourceType: 'web_app',
          scope: option.scope,
          serviceName: 'web',
        })
      ),
    };
  }

  protected db_migration(option: AddScopeOption): JobMatrixConfigs<TCredential>['db_migration'][number] {
    const dbMigrationName = createResourceName({
      name: '',
      type: 'sql_database',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(dbMigrationName),
      type: 'sql_database',
      name: dbMigrationName,
      scope: option.scope,
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: dbMigrationName,
          resourceType: 'sql_database',
          scope: option.scope,
          serviceName: 'db_migration',
        })
      ),
    };
  }

  protected mobile_api(option: AddScopeOption): JobMatrixConfigs<TCredential>['mobile_api'][number] {
    const mobileApiName = createResourceName({
      name: 'mobile-api',
      type: 'app_service',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(mobileApiName),
      type: 'web_app',
      name: mobileApiName,
      scope: option.scope,
      slot_name: 'production',
      resource_group: option.resourceGroup ?? '',
      metadata: {
        subscription_id: option.subscriptionId,
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: mobileApiName,
          resourceType: 'web_app',
          scope: option.scope,
          serviceName: 'mobile_api',
        })
      ),
    };
  }

  protected api(option: AddScopeOption): JobMatrixConfigs<TCredential>['api'][number] {
    const apiName = createResourceName({
      name: 'api',
      type: 'app_service',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(apiName),
      type: 'web_app',
      name: apiName,
      scope: option.scope,
      slot_name: 'production',
      resource_group: option.resourceGroup ?? '',
      metadata: {
        subscription_id: option.subscriptionId,
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: apiName,
          resourceType: 'web_app',
          scope: option.scope,
          serviceName: 'api',
        })
      ),
    };
  }

  protected identityserver(option: AddScopeOption): JobMatrixConfigs<TCredential>['identityserver'][number] {
    const identityServerName = createResourceName({
      name: 'identityserver',
      type: 'app_service',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(identityServerName),
      type: 'web_app',
      name: identityServerName,
      scope: option.scope,
      slot_name: 'production',
      resource_group: option.resourceGroup ?? '',
      metadata: {
        subscription_id: option.subscriptionId,
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: identityServerName,
          resourceType: 'web_app',
          scope: option.scope,
          serviceName: 'identityserver',
        })
      ),
    };
  }

  protected auth_gateway(option: AddScopeOption): JobMatrixConfigs<TCredential>['auth_gateway'][number] {
    const authGatewayName = createResourceName({
      name: 'auth-gateway',
      type: 'app_service',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(authGatewayName),
      type: 'web_app',
      name: authGatewayName,
      scope: option.scope,
      slot_name: 'production',
      resource_group: option.resourceGroup ?? '',
      metadata: {
        subscription_id: option.subscriptionId,
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: authGatewayName,
          resourceType: 'web_app',
          scope: option.scope,
          serviceName: 'auth_gateway',
        })
      ),
    };
  }

  protected service_discovery(option: AddScopeOption): JobMatrixConfigs<TCredential>['service_discovery'][number] {
    const serviceDiscoveryName = createResourceName({
      name: 'service-discovery',
      type: 'function_app',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(serviceDiscoveryName),
      type: 'function_app',
      name: serviceDiscoveryName,
      scope: option.scope,
      resource_group: option.resourceGroup ?? '',
      slot_name: 'production',
      metadata: {
        subscription_id: option.subscriptionId,
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: serviceDiscoveryName,
          resourceType: 'function_app',
          scope: option.scope,
          serviceName: 'service_discovery',
        })
      ),
    };
  }

  protected background_job(option: AddScopeOption): JobMatrixConfigs<TCredential>['background_job'][number] {
    const backgroundJobName = createResourceName({
      name: 'background',
      type: 'function_app',
      ...this.option.env,
      ...resolveScopeForResourceName(option.scope),
    });
    return {
      id: this.parseId(backgroundJobName),
      type: 'function_app',
      name: backgroundJobName,
      scope: option.scope,
      resource_group: option.resourceGroup ?? '',
      slot_name: 'production',
      metadata: {
        subscription_id: option.subscriptionId,
      },
      credential: this.getCredential(
        createKeyVaultSecretName({
          resourceName: backgroundJobName,
          resourceType: 'function_app',
          scope: option.scope,
          serviceName: 'background_job',
        })
      ),
    };
  }
}
