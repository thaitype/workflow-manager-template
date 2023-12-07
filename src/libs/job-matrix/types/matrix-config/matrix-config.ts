import { Scope } from '../../scope';
import { Config } from '../common';
import { CredentialConfig } from '../credential-config';

export interface WithServicePrincipalName {
  service_principal_name: string;
}

export interface MatrixConfigBase<TType extends string, TCredential extends CredentialConfig, TMetadata = undefined>
  extends Config<TType> {
  /**
   * The unique identifier of the config e.g. resource name
   */
  id: string;

  /**
   * resource scope, e.g. contractor, common
   */
  scope: Scope;
  /**
   * Credential for getting config from any key store e.g. KeyVault
   */
  credential: TCredential;
  /**
   * Additional Metadata for the config
   */
  metadata?: TMetadata;
}
