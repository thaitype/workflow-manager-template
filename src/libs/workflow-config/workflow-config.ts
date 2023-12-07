import { WorkflowEnvConfig, WorkflowParserOption, parseWorkflowEnvConfig } from './parse-workflow-config';
import { EnvLike, PromiseLike } from '../../types';
import { z } from 'zod';
import { toError } from '../utils';
import { CredentialConfig, JobMatrixConfigs } from '../job-matrix/types';

export class WorkflowConfig {
  constructor(protected option?: Partial<WorkflowParserOption>) {}

  create<TCredential extends CredentialConfig>(
    callback: (config: WorkflowEnvConfig) => PromiseLike<JobMatrixConfigs<TCredential>>
  ) {
    return (env: EnvLike): PromiseLike<JobMatrixConfigs<TCredential>> => {
      try {
        const recordSchema = z.record(z.string().optional());
        const _env = recordSchema.parse(env);
        const _config = parseWorkflowEnvConfig(_env, this.option);
        return callback(_config);
      } catch (error) {
        return Promise.reject(toError(error));
      }
    };
  }
}
