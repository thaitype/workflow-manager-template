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
      environment: 'dev',
      environment_short: 'dev',
    },
    credential: {
      type: 'github_secret',
      gh_secret_name: 'AZURE_CREDENTIAL__RG__DEV',
    },
    enableJobs: config.enableJobs,
  });

  jobMatrix.addTenants(config.enableTenants, {
    tenantConfig: {
      subscriptionId: Subscription['My Subscription'],
      resourceGroup: 'rg-wmgr-dev',
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

  /**
   * Override the storage account name because in Dev ,
   * we use the same storage account for all tenants
   */
  jobMatrix.config.react = jobMatrix.config.react.map(job => ({
    ...job,
    storage_account_name: 'twmrdatadevcommonfile',
  }));

  return jobMatrix.config;
});
