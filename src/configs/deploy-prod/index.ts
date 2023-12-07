import { JobMaxtrix, Subscription, WorkflowConfig } from '../../libs';
const workflowConfig = new WorkflowConfig();

export default workflowConfig.create(config => {
  // ----------------------------------------------------------------------
  // 1. Create a config file for naming conventions
  // ----------------------------------------------------------------------

  const jobMatrix = new JobMaxtrix({
    env: {
      org: 'thadaw',
      project: 'wmgr',
      project_short: 'twmr',
      environment: 'prod',
      environment_short: 'prod',
    },
    credential: {
      type: 'key_vault',
      gh_secret_name: 'AZURE_CREDENTIAL__KEY_VAULT__TWMR_PROD_GITHUB',
      vault_name: 'twmr-prod-github',
    },
  });

  jobMatrix.addTenants(config.enableTenants, {
    overrideTenantConfig: {
      contractor: {
        subscriptionId: Subscription['My Subscription'],
      },
      utility_ccc: {
        subscriptionId: Subscription['My Subscription'],
      },
      utility_bbb: {
        subscriptionId: Subscription['My Subscription'],
      },
      utility_aaa: {
        subscriptionId: Subscription['My Subscription'],
      },
    },
    except: [
      {
        tenant: 'contractor',
        job: 'background_job',
      },
    ],
  });

  // ----------------------------------------------------------------------
  // 2. Override the with legacy naming convention
  // ----------------------------------------------------------------------




  return jobMatrix.config;
});
