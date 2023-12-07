import invariant from 'tiny-invariant';
import { toError } from '../libs/utils';
import { JobMaxtrix, WorkflowConfig } from '../libs';
import path from 'node:path';

function validateConfigGenerator(
  value: unknown
): asserts value is ReturnType<(typeof WorkflowConfig)['prototype']['create']> {
  if (typeof value !== 'function') throw new Error('The config generator must be a function');
}

async function main() {
  const configPath = process.argv[2];
  const outputName = process.argv[3] ?? 'matrix';
  invariant(configPath, 'Config path is required e.g. yarn set-output src/configs/deploy-atom');
  const configGenerator = (await import(path.join('../../', configPath))).default as unknown;
  validateConfigGenerator(configGenerator);
  const config = await configGenerator(process.env);
  console.log(outputName, 'outputName');
  JobMaxtrix.setOutput(config, outputName);
}

main().catch(toError);
