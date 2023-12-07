/**
 * For generating Azure resource IDs.
 */

export interface ResourceConfig {
  subscriptionId: string;
  resourceGroup: string;
  name: string;
}

export const keyVault = (config: ResourceConfig) =>
  `/subscriptions/${config.subscriptionId}/resourceGroups/${config.resourceGroup}/providers/Microsoft.KeyVault/vaults/${config.name}`;

export const containerApp = (config: ResourceConfig) =>
  `/subscriptions/${config.subscriptionId}/resourceGroups/${config.resourceGroup}/providers/Microsoft.App/containerApps/${config.name}`;

export const storageAccount = (config: ResourceConfig) =>
  `/subscriptions/${config.subscriptionId}/resourceGroups/${config.resourceGroup}/providers/Microsoft.Storage/storageAccounts/${config.name}`;
