import { DefaultAzureCredential } from '@azure/identity';
import { AzureKeyVault, AzureResourceId } from '../../vendors';
import { createServicePrincipalAndAssignRole } from '@thaitype/azure-service-principal';
import { Subscription } from '../../libs';

async function setSecretForDeploy() {
  const credential = new DefaultAzureCredential();
  // await createServicePrincipleAndSetKeyVault(credential, {
  //   displayName: 'DevOps thadaw-software/github-actions-playground Debug Pipeline for Atom Env',
  //   keyVaultName: 'demo-pipeline',
  //   secretName: 'service-principal-credentials',
  //   role: 'Container App Update',
  //   scopes: [
  //     AzureResourceId.containerApp({
  //       name: 'twmr-dev-ctr-fac',
  //       resourceGroup: 'rg-wmgr-dev',
  //       subscriptionId: Subscription['My Subscription'],
  //     }),
  //   ],
  // });

  const data = await createServicePrincipalAndAssignRole({
    name: 'DevOps Debug Pipeline [Atom Env] React',
    role: 'Storage Account Blob Data Contributor',
    scopes: [
      AzureResourceId.storageAccount({
        name: 'twmrdatadevcommonfile',
        resourceGroup: 'rg-wmgr-dev',
        subscriptionId: Subscription['My Subscription'],
      }),
    ],
    jsonAuth: true,
  });

  await new AzureKeyVault(credential).setSecret({
    keyVaultName: 'demo-pipeline',
    secretName: 'service-principal-credentials-react',
    secretValue: JSON.stringify(data),
    metadata: {
      displayName: 'DevOps Debug Pipeline [Atom Env] React',
      contentType: 'json',
      secretType: 'service-principal',
    },
  });
}

setSecretForDeploy();
