import dotenv from 'dotenv';
import { RecordParser } from './record-parser';
import { EnvironmentKeys } from '../environment';
import { Tenant } from '../job-matrix/scope';
import { EnvLike } from '../../types';
import { JobMatrixConfigs } from '../job-matrix/types';
dotenv.config();

export type WorkflowEnvConfig = {
  environmentSpecifier: string | undefined;
  enableTenants: Record<Tenant, boolean>;
  enableJobs: Record<keyof JobMatrixConfigs, boolean>;
};

export interface WorkflowParserOption {
  requiredEnvironmentSpecifier: boolean;
}

export function parseWorkflowEnvConfig(record: EnvLike, _option?: Partial<WorkflowParserOption>): WorkflowEnvConfig {
  const option = {
    requiredEnvironmentSpecifier: _option?.requiredEnvironmentSpecifier ?? false,
    ..._option,
  } as WorkflowParserOption;
  const env = new RecordParser<EnvironmentKeys>(record);
  return {
    environmentSpecifier: env.parseString(
      'ENVIRONMENT_SPECIFIER',
      option.requiredEnvironmentSpecifier ? undefined : ''
    ),
    enableTenants: {
      contractor: env.parseBoolean('ENABLE_CONTRACTOR', true),
      utility_ccc: env.parseBoolean('ENABLE_UTILITY_CCC'),
      utility_aaa: env.parseBoolean('ENABLE_UTILITY_AAA'),
      utility_bbb: env.parseBoolean('ENABLE_UTILITY_BBB'),
      utility_demo: env.parseBoolean('ENABLE_UTILITY_DEMO'),
    },
    enableJobs: {
      react: env.parseBoolean('ENABLE_JOB_REACT'),
      bff: env.parseBoolean('ENABLE_JOB_BFF'),
      facing: env.parseBoolean('ENABLE_JOB_FACING'),
      realtime_msg_center: env.parseBoolean('ENABLE_JOB_REALTIME_MSG_CENTER'),
      tunnel: env.parseBoolean('ENABLE_JOB_TUNNEL'),
      db_migration: env.parseBoolean('ENABLE_JOB_DB_MIGRATION'),
      web: env.parseBoolean('ENABLE_JOB_WEB'),
      mobile_api: env.parseBoolean('ENABLE_JOB_MOBILE_API'),
      api: env.parseBoolean('ENABLE_JOB_API'),
      identityserver: env.parseBoolean('ENABLE_JOB_IDENTITYSERVER'),
      auth_gateway: env.parseBoolean('ENABLE_JOB_AUTH_GATEWAY'),
      service_discovery: env.parseBoolean('ENABLE_JOB_SERVICE_DISCOVERY'),
      background_job: env.parseBoolean('ENABLE_JOB_BACKGROUND_JOB'),
    },
  };
}
