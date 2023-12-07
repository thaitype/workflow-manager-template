import { CredentialConfig } from '../credential-config';
import { MatrixConfigBase, WithServicePrincipalName } from './matrix-config';

export interface ReactConfigMetadata extends WithServicePrincipalName {
  /**
   * Subscription ID
   *
   * @note Using for Generate Azure Service Principal Only, Not for Deploy
   */
  subscription_id: string;
  /**
   * Azure Resource Group
   *
   * @note Using for Generate Azure Service Principal Only, Not for Deploy
   */
  resource_group: string;
}

export interface ReactConfig<TCredential extends CredentialConfig>
  extends MatrixConfigBase<'react', TCredential, ReactConfigMetadata> {
  /**
   * Storage Account Name
   */
  storage_account_name: string;
}
