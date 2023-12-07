import { createServicePrincipalAndAssignRole } from '@thaitype/azure-service-principal';
import { AzureResourceId, setGithubSecret } from '../vendors';
import { createServicePricinpleName } from '../utils/create-service-principle-name';
import { Subscription } from '../libs/azure';

async function main() {
  const vaultName = 'twmr-prod-github';
  const secret = await createServicePrincipalAndAssignRole({
    name: createServicePricinpleName({
      envName: 'prod',
      serviceName: 'deploy',
      actionName: 'keyvault/admin',
      resourceName: vaultName,
      scope: 'common',
      location: 'github-actions',
    }),
    role: 'Key Vault Administrator',
    scopes: [
      AzureResourceId.keyVault({
        name: vaultName,
        resourceGroup: 'rg-wmgr-prod-common',
        subscriptionId: Subscription['My Subscription'],
      }),
    ],
    jsonAuth: true,
  });

  await setGithubSecret({
    secretName: 'AZURE_CREDENTIAL__KEY_VAULT__TWMR_PROD_GITHUB',
    secretValue: JSON.stringify(secret),
    repo: 'thaitype/workflows-production',
  });
}

main();
