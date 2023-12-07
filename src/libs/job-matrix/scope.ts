import type { Enum } from './types';

/**
 * Intention for using snake case for the scope.
 */
export const Scope = {
  contractor: 'contractor',
  utility_aaa: 'utility_aaa',
  utility_ccc: 'utility_ccc',
  utility_bbb: 'utility_bbb',
  utility_demo: 'utility_demo',
  // NOTE: Temporarily disable DOT until the DOT pipeline is complex enough.
  // utility_dot: 'utility_dot',
  common: 'common',
} as const;

/**
 * Tenant name for each scope.
 * Unique ID used to identify the tenant in Tenant Config both `tenant.json` and Tenant Config in the App Settings i.e. `TenantConfigurations`.
 */
export const TenantName: Record<Scope, string | undefined> = {
  utility_aaa: 'AAA',
  utility_ccc: 'CCC',
  utility_bbb: 'BBB',
  contractor: 'Contractor',
  utility_demo: 'DEMO',
  common: undefined,
};

/**
 * Type of the scope.
 */
export type Scope = Enum<typeof Scope>;

/**
 * Tenant is the scope except `common`.
 */
export type Tenant = Exclude<Scope, 'common'>;


export interface ResourceNameScopeVariant {
  scope: string;
  scope_short: string;
  scope_shortest: string;
}

/**
 * Resolving the scope for the resource name in various environments.
 * @param scope
 * @returns
 */

export function resolveScopeForResourceName(scope: Scope): ResourceNameScopeVariant {
  switch (scope) {
    case 'common':
      return {
        scope: 'common',
        scope_short: 'common',
        scope_shortest: 'com',
      };
    case 'contractor':
      return {
        scope: 'contractor',
        scope_short: 'contr',
        scope_shortest: 'ctr',
      };
    case 'utility_ccc':
      return {
        scope: 'utility_ccc',
        scope_short: 'ccc',
        scope_shortest: 'ccc',
      };
    case 'utility_aaa':
      return {
        scope: 'utility_aaa',
        scope_short: '',
        scope_shortest: '',
      };
    case 'utility_bbb':
      return {
        scope: 'utility_bbb',
        scope_short: 'bbb',
        scope_shortest: 'bbb',
      };
    case 'utility_demo':
      return {
        scope: 'utility_demo',
        scope_short: 'demo',
        scope_shortest: 'demo',
      };
    default:
      throw new Error(`Unknown scope: ${scope}`);
  }
}
