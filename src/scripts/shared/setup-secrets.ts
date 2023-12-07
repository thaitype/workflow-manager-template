import { DefaultAzureCredential } from '@azure/identity';
import invariant from 'tiny-invariant';
import { createServicePrincipalAndAssignRole } from '@thaitype/azure-service-principal';
import { AzureAppService, AzureKeyVault, AzureResourceId } from '../../vendors/azure';
import { JobMatrixConfigs, KeyVaultConfig } from '../../libs/job-matrix/types';

type JobMatrixConfig = JobMatrixConfigs<KeyVaultConfig>[keyof JobMatrixConfigs<KeyVaultConfig>][number];

export async function setupSecrets(
  credential: DefaultAzureCredential,
  jobMatrixConfigs: JobMatrixConfigs<KeyVaultConfig>
) {
  for (const [key, _] of Object.entries(jobMatrixConfigs)) {
    const configs = jobMatrixConfigs[key as keyof JobMatrixConfigs<KeyVaultConfig>];
    if (!Array.isArray(configs)) continue;

    for (const config of configs.values()) {
      // TODO: Make it pallarel later
      await processConfig(credential, config);
    }
  }
}

export async function processConfig(credential: DefaultAzureCredential, config: JobMatrixConfig) {
  console.log(`Setup config for '${config.id}' with type ${config.type}`);
  switch (config.type) {
    case 'react':
      return setupSecretsForReact(credential, config);
    case 'container_app':
      return setupSecretsForContainerApp(credential, config);
    case 'function_app':
      return setupSecretsForFunctionApp(credential, config);
    default:
      throw new Error(`Unknown config type: ${config['type']}`);
  }
}

export async function setupSecretsForReact<TJobMatrixType extends JobMatrixConfig & { type: 'react' }>(
  credential: DefaultAzureCredential,
  config: TJobMatrixType
) {
  invariant(config.metadata, 'Metadata is not defined');
  const secretValue = await createServicePrincipalAndAssignRole({
    name: config.metadata.service_principal_name,
    role: 'Storage Account Blob Upload Batch',
    scopes: [
      AzureResourceId.storageAccount({
        name: config.storage_account_name,
        resourceGroup: config.metadata.resource_group,
        subscriptionId: config.metadata.subscription_id,
      }),
    ],
    jsonAuth: true,
  });

  invariant(config.credential.secret_name, `[${config.id}] Secret name is not defined`);
  await new AzureKeyVault(credential).setSecret({
    keyVaultName: config.credential.vault_name,
    secretName: config.credential.secret_name,
    secretValue: JSON.stringify(secretValue),
    metadata: {
      displayName: config.metadata.service_principal_name,
      contentType: 'json',
      secretType: 'service-principal',
    },
  });
}

export async function setupSecretsForContainerApp<TJobMatrixType extends JobMatrixConfig & { type: 'container_app' }>(
  credential: DefaultAzureCredential,
  config: TJobMatrixType
) {
  invariant(config.metadata, 'Metadata is not defined');

  const secretValue = await createServicePrincipalAndAssignRole({
    name: config.metadata.service_principal_name,
    role: 'Container App Update',
    scopes: [
      AzureResourceId.containerApp({
        name: config.name,
        resourceGroup: config.resource_group,
        subscriptionId: config.metadata.subscription_id,
      }),
    ],
    jsonAuth: true,
  });

  invariant(config.credential.secret_name, `[${config.id}] Secret name is not defined`);
  await new AzureKeyVault(credential).setSecret({
    keyVaultName: config.credential.vault_name,
    secretName: config.credential.secret_name,
    secretValue: JSON.stringify(secretValue),
    metadata: {
      displayName: config.metadata.service_principal_name,
      contentType: 'json',
      secretType: 'service-principal',
    },
  });
}

export async function setupSecretsForFunctionApp<TJobMatrixType extends JobMatrixConfig & { type: 'function_app' }>(
  credential: DefaultAzureCredential,
  config: TJobMatrixType
) {
  invariant(config.metadata, 'Metadata is not defined');

  const publishProfile = await new AzureAppService(credential).listPublishProfile({
    subscriptionId: config.metadata.subscription_id,
    appName: config.name,
    resourceGroup: config.resource_group,
  });

  invariant(config.credential.secret_name, `[${config.id}] Secret name is not defined`);
  await new AzureKeyVault(credential).setSecret({
    keyVaultName: config.credential.vault_name,
    secretName: config.credential.secret_name,
    secretValue: publishProfile,
    metadata: {
      contentType: 'xml',
      secretType: 'publish-profile',
    },
  });
}
