// Migrated from .github/workflows/configs/atom-deploy-environment/tenant-json.js

import { Scope, TenantName } from '../libs';
import { toError } from '../libs/utils';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

export interface Tenant {
  tenantName: string;
  /**
   * Tenant API URL: No trailing Slash
   */
  tenantUrl: string;
  /**
   * Tenant Web URL: No trailing Slash
   */
  tenantWebUrl: string;
  tenantType: 'Utility' | 'Contractor';
  /**
   * Storage Account Blob URL: No trailing Slash
   */
  azureStorageRootPath: string;
  azureStorageConnectionString: string;
}

async function main() {
  console.log('Generating tenant.json');
  const tenantConfigFile = process.argv[2] ?? '';
  const azureStorageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING ?? '';
  const environment = process.env.ENVIRONMENT;
  const isEnabledUtilityAAA = process.env.ENABLE_UTILITY_AAA === 'true' ? true : false;
  const isEnabledUtilityCCC = process.env.ENABLE_UTILITY_CCC === 'true' ? true : false;
  const isEnabledUtilityBBB = process.env.ENABLE_UTILITY_BBB === 'true' ? true : false;
  const azureStorageRootPath = 'https://twmrdataatom.blob.core.windows.net';
  if (!environment) throw new Error(`"ENVIRONMENT" environment var is required!`);
  if (azureStorageConnectionString === '')
    throw new Error(`"AZURE_STORAGE_CONNECTION_STRING" environment var is required!`);

  const tenantMetaList: Tenant[] = [];

  /**
   * Get Tenant API URL
   */
  const getTenantApiURL = (env: keyof typeof Scope) => {
    const envName = Scope[env];
    const tenant = envName.replaceAll('_', '-');
    return `https://thadawwmgr-atom-${environment}-${tenant}-api.azurewebsites.net`;
  };

  /**
   * Get Tenant Web URL
   */
  const getTenantWebURL = (env: keyof typeof Scope) => {
    const envName = Scope[env];
    const tenant = envName.replaceAll('_', '-');
    return `https://thadawwmgr-atom-${environment}-${tenant}.azurewebsites.net`;
  };

  /**
   * Append Tenant Config
   */
  function appendTenant(env: keyof typeof Scope, tenantType: Tenant['tenantType']) {
    tenantMetaList.push({
      tenantName: TenantName[env] || '',
      tenantUrl: getTenantApiURL(env),
      tenantWebUrl: getTenantWebURL(env),
      tenantType: tenantType,
      azureStorageRootPath,
      azureStorageConnectionString,
    });
  }

  appendTenant('contractor', 'Contractor');
  if (isEnabledUtilityAAA === true) appendTenant('utility_aaa', 'Utility');
  if (isEnabledUtilityBBB === true) appendTenant('utility_bbb', 'Utility');
  if (isEnabledUtilityCCC === true) appendTenant('utility_ccc', 'Utility');

  console.log(`Writing tenant.json to ${tenantConfigFile}`);
  console.debug(JSON.stringify(tenantMetaList, null, 2));
  await fs.writeFile(tenantConfigFile, JSON.stringify(tenantMetaList, null, 2));
}

main().catch(toError);
