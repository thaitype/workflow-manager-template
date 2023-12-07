import { z } from 'zod';

function parseName(name: string) {
  return name.replace(/_/g, '-').replace(/ /g, '-');
}

/**
 *
 * Name Limitations  (From Azure Portal)
 *
 * - Secret names can only contain alphanumeric characters and dashes.
 * - The value must be between 1 and 127 characters long.
 *
 * Example
 *
 * dev--tunnel--container-app--twmr-dev-bbb-tun--v1
 *
 * @param option
 * @returns
 */

export function createKeyVaultSecretName(option: {
  scope: string;
  serviceName: string;
  resourceName: string;
  resourceType: string;
  version?: string;
}): string {
  const nameSchema = z
    .string()
    .min(1)
    .max(127)
    .refine(value => /^[A-Za-z0-9\-]+$/.test(value), 'Name should only contain alphanumeric characters and dashes');
  const version = option.version ?? 'v1';

  const result = [
    parseName(option.scope),
    parseName(option.serviceName),
    parseName(option.resourceType),
    parseName(option.resourceName),
    parseName(version),
  ].join('--');
  return nameSchema.parse(result);
}
