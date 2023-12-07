import { createServicePrincipalAndAssignRole } from '@thaitype/azure-service-principal';
import { AzureResourceId, setGithubSecret } from '../../vendors';
import { Subscription } from '../../libs';

async function main() {
  const secret = await createServicePrincipalAndAssignRole({
    name: 'web-workflows-techstack',
    role: 'Key Vault Administrator',
    scopes: [
      AzureResourceId.keyVault({
        name: 'demo-pipeline',
        resourceGroup: 'rg-devops-playground',
        subscriptionId: Subscription['My Subscription'],
      }),
    ],
    jsonAuth: true,
  });

  await setGithubSecret({
    secretName: 'AZURE_CREDENTIAL_GET_KEY_VAULT',
    secretValue: JSON.stringify(secret),
    repo: 'thaitype/workflows-techstack',
  });
}

main();
