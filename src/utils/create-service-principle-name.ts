import { z } from 'zod';

/**
 * Example: [dev] tunnel containerapp/update twmr-dev-bbb-tun github-action (v1)
 *
 * Name Limitations  (From Azure Portal)
 * - Less than 120 characters in length
 **/

export function createServicePricinpleName(option: {
  envName: string;
  scope: string;
  serviceName: string;
  resourceName: string;
  actionName: string;
  location?: string;
  version?: string;
}): string {
  const nameSchema = z.string().max(120);
  const version = option.version ?? 'v1';
  const result = [
    `[${option.envName}]`,
    option.scope,
    option.serviceName,
    option.actionName,
    option.resourceName,
    option.location,
    `(${version})`,
  ].join(' ');
  return nameSchema.parse(result);
}
