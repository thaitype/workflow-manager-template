import { CredentialConfig } from '../credential-config';
import { MatrixConfigBase } from './matrix-config';

export interface FunctionAppConfigMetadata {
  /**
   * Subscription ID
   *
   * @note Using for Generate Azure Service Principal Only, Not for Deploy
   */
  subscription_id: string;
  // /**
  //  * Azure Resource Group
  //  *
  //  * @note Using for Generate Azure Service Principal Only, Not for Deploy
  //  */
  // resource_group: string;
}

export interface FunctionAppConfig<TCredential extends CredentialConfig>
  extends MatrixConfigBase<'function_app', TCredential, FunctionAppConfigMetadata> {
  /**
   * Azure Function App Name
   */
  name: string;
  /**
   * Azure Resource Group
   *
   * @note
   * 1. Using when github secret credential is set,
   * Using for Deploy Only, Not for Generate Azure Service Principal
   * In case of getting publish profile from Azure CLI
   *
   * 2. Using for Generate Azure Service Principal Only, Not for Deploy
   */
  resource_group: string;

  /**
   * Slot Name e.g. production, staging
   */
  slot_name: string;
}
