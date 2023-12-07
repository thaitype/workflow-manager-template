import * as core from '@actions/core';
import { toError } from '../libs/utils';

async function main() {
  const databaseServer = process.argv[2];
  const databaseName = process.argv[3];
  const databaseUser = 'admindb';
  const databasePassword = process.argv[4];
  const port = 1433;
  const connection_string = `Server=${databaseServer}.database.windows.net,${port};Initial Catalog=${databaseName};Persist Security Info=False;User ID=${databaseUser};Password=${databasePassword};MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=True;Connection Timeout=15;`;
  console.debug(connection_string);
  core.setOutput('connection-string', connection_string);
}

main().catch(toError);
