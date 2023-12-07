# Workflow Manager

Github Actions Workflow Manager Template for managing complex job deployment securely

## Features
- Support multiples Env by design i.e., Atom , Dev , UAT , Prod .
- Support various credential types:
  - `key_vault`  Use in UAT , Prod .
  - `github_secret` Use in Atom , Dev .
- Use the same config (which is used in the pipeline matrix) to generate Azure Service Principle and other related credentials and store in the Azure Key Vault

## Todo
- Using Json Schema for https://github.com/StefanTerdell/zod-to-json-schema

## 1. Setup Secrets for Workflows

Using scripts for manage secret Azure and Github.

```bash
# For UAT 
yarn tsx ./src/scripts/setup-secrets-uat.ts
# For PROD 
yarn tsx ./src/scripts/setup-secrets-prod.ts
```

## 2. Using Config for Github Actions Workflows

```bash
# For UAT 
export WORKFLOW_ENV=production yarn tsx ./src/configs/deploy-uat/index.ts
# For PROD 
export WORKFLOW_ENV=production yarn tsx ./src/configs/deploy-prod/index.ts
```

### Using Example with Github Actions Workflows

```yaml
jobs:
  get-matrix:
    runs-on: ubuntu-latest
    outputs:
      deployment-matrix: ${{ steps.export-deployment-matrix.outputs.deployment-matrix }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'yarn'
          cache-dependency-path: '.github/workflows/workflow-manager/yarn.lock'
      - name: Export deployment matrix
        id: export-deployment-matrix
        run: |
          yarn --frozen-lockfile --prod
          yarn tsx ./src/configs/deploy-uat/index.ts deployment-matrix
        env:
          WORKFLOW_ENV: production
          ENVIRONMENT_SPECIFIER: sm1234pr1234
          ENABLE_UTILITY_AAA: true
          ENABLE_UTILITY_CCC: true
          ENABLE_UTILITY_BBB: true
          ENABLE_JOB_REACT: true
          ENABLE_JOB_BFF: true
          ENABLE_JOB_FACING: true
          ENABLE_JOB_REALTIME_MSG_CENTER: true
          ENABLE_JOB_TUNNEL: true
          ENABLE_JOB_WEB: true
          ENABLE_JOB_API: true
          ENABLE_JOB_MOBILE_API: true
          ENABLE_JOB_IDENTITYSERVER: true
          ENABLE_JOB_AUTH_GATEWAY: true
          ENABLE_JOB_SERVICE_DISCOVERY: true
          ENABLE_JOB_BACKGROUND_JOB: true
          ENABLE_JOB_DB_MIGRATION: true
```

## 3. Using Connection String Generator

Note: the `[database_user]` will fixed as `admindb`, generally use this only in Dev  or Atom 

```bash
yarn tsx ./src/scripts/generate-connection-string.ts [database_server] [database_name] [database_password]
```

## Naming Convention

Some of TypeScript will use `snakecase` for similar with Github Actions.

## Custom Roles

### Create Custom Roles

```bash
az role definition create --role-definition "./src/scripts/roles/container-app-update.json"
az role definition create --role-definition "./src/scripts/roles/storage-account-blob-upload-batch.json"
```

## Update Custom Roles
```bash
az role definition update --role-definition "./src/scripts/roles/container-app-update.json"
az role definition update --role-definition "./src/scripts/roles/storage-account-blob-upload-batch.json"
```

## Node.js Runtime Support only up to 18

Because:

- error @azure/msal-node@1.18.3: The engine "node" is incompatible with this module. Expected version "10 || 12 || 14 || 16 || 18". Got "20.4.0"

