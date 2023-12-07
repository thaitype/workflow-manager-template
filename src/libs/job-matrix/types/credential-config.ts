import { Config } from './common';

export interface KeyVaultConfig extends Config<'key_vault'> {
  /**
   * Github Actions Secret Name storing Azure Service Service Principal for accessing Azure Key Vault
   */
  gh_secret_name: string;
  /**
   * Azure Key Vault Name
   */
  vault_name: string;
  /**
   * Azure Key Vault Secret Name
   */
  secret_name?: string;
}

export interface GithubSecretConfig extends Config<'github_secret'> {
  /**
   * Github Actions Secret Name storing Azure Service Service Principal for accessing that resource
   */
  gh_secret_name: string;
}

// export type CredentialType = (KeyVaultConfig | GithubSecretConfig)['type'];

export type CredentialConfig = KeyVaultConfig | GithubSecretConfig;
