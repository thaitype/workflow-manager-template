import type { Enum } from './types';

export const ResourceType = {
  static: 'static',
  static_app_service: 'static_app_service',
  static_mssql_server: 'static_mssql_server',
  resource_group: 'resource_group',
  storage_account: 'storage_account',
  storage_account_short: 'storage_account_short',
  log_analytics_workspace: 'log_analytics_workspace',
  container_app_environment: 'container_app_environment',
  container_app: 'container_app',
  logic_app: 'logic_app',
  container_registry: 'container_registry',
  cdn_profile: 'cdn_profile',
  signalr: 'signalr',
  mongo: 'mongo',
  app_service_plan: 'app_service_plan',
  app_service_plan_short: 'app_service_plan_short',
  container_group: 'container_group',
  app_service: 'app_service',
  function_app: 'function_app',
  mssql_server: 'mssql_server',
  sql_database: 'sql_database',
} as const;

export type ResourceType = Enum<typeof ResourceType>;

export interface EnvironmentAttributes {
  org: string;
  project: string;
  project_short: string;
  environment: string;
  environment_short: string;
}

export interface ResourceTypeAttributes<TType extends ResourceType> {
  type: TType;
}

export interface ResourceAttributes {
  name: string;
  scope: string;
  scope_short: string;
  scope_shortest: string;
}

export type Attributes<TType extends ResourceType> = EnvironmentAttributes &
  ResourceTypeAttributes<TType> &
  ResourceAttributes;

const replaceUnderscoresWithHyphens = (input: string): string => input.replace(/_/g, '-');
const trimSuffix = (input: string, suffix: string): string => input;

interface Hostnames {
  app_service: string;
  function_app: string;
  mssql_server: string;
  static_app_service: string;
  static_mssql_server: string;
}

interface URLs {
  app_service: string;
  function_app: string;
  static_app_service: string;
}

const validateResourceType = (type: string): type is ResourceType =>
  Object.values(ResourceType).includes(type as ResourceType);

interface ResourceInfo {
  name: string;
  defaultHostname: string;
  url: string;
}

interface ResourceInfoOption {
  hostnameProtocol?: 'http' | 'https';
  seperator?: string;
  seperatorShort?: string;
}

export function createResourceInfo<TType extends ResourceType>(
  attributes: Attributes<TType>,
  option?: ResourceInfoOption
): ResourceInfo {
  const hostnameProtocol = option?.hostnameProtocol || 'https';
  const seperator = option?.seperator || '-';
  const seperatorShort = option?.seperatorShort || '';

  const parsedScope = replaceUnderscoresWithHyphens(attributes.scope);
  const parsedScopeShort = replaceUnderscoresWithHyphens(attributes.scope_short).replace('-', seperatorShort);
  const parsedScopeShortest = replaceUnderscoresWithHyphens(attributes.scope_shortest).replace('-', seperatorShort);
  const parsedName = replaceUnderscoresWithHyphens(attributes.name);
  const parsedNameList = parsedName === '' ? [] : [parsedName];
  const parsedEnv = attributes.environment.replace('-', '');
  const orgWithProject = `${attributes.org}${attributes.project}`;
  const environmentShort = attributes.environment_short || '';
  const parsedEnvShort = replaceUnderscoresWithHyphens(environmentShort).replace('-', '');

  const resourceTypes: Record<ResourceType, string> = {
    [ResourceType.static]: parsedName,
    [ResourceType.static_app_service]: parsedName,
    [ResourceType.static_mssql_server]: parsedName,
    [ResourceType.resource_group]: ['rg', attributes.project, attributes.environment, parsedScope].join(seperator),

    [ResourceType.storage_account]: [
      attributes.project_short,
      'data',
      parsedEnv,
      parsedScopeShort,
      ...parsedNameList,
    ].join(seperatorShort),

    [ResourceType.storage_account_short]: [
      attributes.project_short,
      parsedEnvShort,
      parsedScopeShort,
      ...parsedNameList,
    ].join(seperatorShort),

    [ResourceType.log_analytics_workspace]: [
      orgWithProject,
      'loganalyticsworkspace',
      attributes.environment,
      parsedScope,
      ...parsedNameList,
    ].join(seperator),

    [ResourceType.container_app_environment]: ['thadawwmgr', attributes.environment, parsedScope, 'container-env'].join(
      seperator
    ),

    [ResourceType.container_app]: [
      attributes.project_short,
      attributes.environment_short,
      parsedScopeShortest,
      ...parsedNameList,
    ].join(seperator),

    [ResourceType.logic_app]: [attributes.project_short, environmentShort, parsedScopeShort, ...parsedNameList].join(
      seperator
    ),

    [ResourceType.container_registry]: [attributes.project_short, parsedEnv, parsedScopeShort, ...parsedNameList].join(
      seperatorShort
    ),

    [ResourceType.cdn_profile]: [
      attributes.project_short,
      environmentShort,
      parsedScopeShortest,
      ...parsedNameList,
    ].join(seperator),

    [ResourceType.signalr]: [attributes.project_short, environmentShort, parsedScopeShortest, ...parsedNameList].join(
      seperator
    ),

    [ResourceType.mongo]: [attributes.project_short, environmentShort, parsedScopeShortest, ...parsedNameList].join(
      seperator
    ),

    [ResourceType.app_service_plan]: [
      'ap',
      attributes.project,
      attributes.environment,
      parsedScope,
      ...parsedNameList,
    ].join(seperator),

    [ResourceType.app_service_plan_short]: [
      'ap',
      attributes.project,
      environmentShort,
      parsedScopeShort,
      ...parsedNameList,
    ].join(seperator),

    [ResourceType.container_group]: [orgWithProject, attributes.environment, parsedScope, ...parsedNameList, 'ci'].join(
      seperator
    ),

    [ResourceType.app_service]: [orgWithProject, attributes.environment, parsedScope, ...parsedNameList].join(
      seperator
    ),

    [ResourceType.function_app]: [orgWithProject, attributes.environment, parsedScope, ...parsedNameList].join(
      seperator
    ),

    [ResourceType.mssql_server]: [orgWithProject, attributes.environment, parsedScope, ...parsedNameList].join(
      seperator
    ),

    [ResourceType.sql_database]: [attributes.project, attributes.environment, parsedScope, ...parsedNameList].join(
      seperator
    ),
  };

  const hostnames: Partial<Record<ResourceType, string>> = {
    app_service: `${resourceTypes.app_service}.azurewebsites.net`,
    function_app: `${resourceTypes.function_app}.azurewebsites.net`,
    mssql_server: `${resourceTypes.mssql_server}.database.windows.net`,
    static_app_service: `${resourceTypes.static_app_service}.azurewebsites.net`,
    static_mssql_server: `${resourceTypes.static_mssql_server}.azurewebsites.net`,
  };

  const urls: Partial<Record<ResourceType, string>> = {
    app_service: `${hostnameProtocol}://${hostnames.app_service}`,
    function_app: `${hostnameProtocol}://${hostnames.function_app}`,
    static_app_service: `${hostnameProtocol}://${hostnames.static_app_service}`,
  };

  // TODO: Fix Type later, `resourceType` should be type of `ResourceTypeEnum`
  const resourceType = validateResourceType(attributes.type) ? (attributes.type as ResourceType) : 'something-wrong??';

  if (resourceType === 'something-wrong??') throw new Error('something-wrong??');

  return {
    name: resourceTypes[resourceType],
    defaultHostname: hostnames[resourceType] ?? '',
    url: urls[resourceType] ?? '',
  };
}

export const createResourceName = (attributes: Attributes<ResourceType>, option?: ResourceInfoOption) =>
  createResourceInfo(attributes, option).name;
