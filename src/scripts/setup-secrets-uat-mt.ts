import { DefaultAzureCredential } from '@azure/identity';
import configGenerator from '../configs/deploy-uat';
import { validateWorkflowEnv } from '../utils/runtime-env';
import { setupSecrets } from './shared/setup-secrets';
import { toError } from '../libs/utils';

async function main() {
  console.log('Start processing configs for UAT ...');
  validateWorkflowEnv();
  const credential = new DefaultAzureCredential();
  const jobMatrixConfigs = await configGenerator(process.env);
  await setupSecrets(credential, jobMatrixConfigs);
}

main().catch(toError);
