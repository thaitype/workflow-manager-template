import { CredentialConfig } from '../credential-config';
import { MatrixConfigBase, WithServicePrincipalName } from './matrix-config';

export interface ContainerAppConfigMetadata extends WithServicePrincipalName {
  /**
   * Subscription ID
   *
   * @note Using for Generate Azure Service Principal Only, Not for Deploy
   */
  subscription_id: string;
}

export interface ContainerAppConfig<TCredential extends CredentialConfig>
  extends MatrixConfigBase<'container_app', TCredential, ContainerAppConfigMetadata> {
  /**
   * Azure Resource Group
   */
  resource_group: string;
  /**
   * Azure Container App Name
   */
  name: string;
}
