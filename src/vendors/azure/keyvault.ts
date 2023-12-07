import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

interface SetSecretConfig {
  keyVaultName: string;
  secretName: string;
  secretValue: string;
  metadata: {
    /**
     * Service Principal Name for the service principal that will be created
     * Keep it blank if you use other type of secret to store.
     */
    displayName?: string;
    secretType: 'service-principal' | 'publish-profile' | (string & {});
    contentType: 'json' | 'xml' | (string & {});
    /**
     * Purpose of the secret,
     * @default 'Deploy with GitHub Actions'
     */
    purpose?: string;
  };
}

export class AzureKeyVault {
  constructor(protected credential: DefaultAzureCredential) {}

  async getSecret(keyVaultName: string, secretName: string) {
    const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
    const secretClient = new SecretClient(keyVaultUrl, this.credential);
    return secretClient.getSecret(secretName);
  }

  async setSecret(config: SetSecretConfig) {
    const keyVaultUrl = `https://${config.keyVaultName}.vault.azure.net`;
    const secretClient = new SecretClient(keyVaultUrl, this.credential);

    // Store the service principal credentials as a secret in Key Vault
    await secretClient.setSecret(config.secretName, config.secretValue, {
      tags: {
        type: config.metadata.secretType,
        purpose: config.metadata.purpose ?? 'Deploy with GitHub Actions',
        displayName: config.metadata.displayName ?? '',
        contentType: config.metadata.contentType,
      },
    });

    console.log(`Service principal credentials stored in Key Vault: ${config.secretName}`);
  }
}
