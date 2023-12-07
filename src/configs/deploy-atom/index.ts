import { JobMaxtrix, Scope, Subscription, WorkflowConfig } from '../../libs';

const workflowConfig = new WorkflowConfig({
  requiredEnvironmentSpecifier: true,
});

export default workflowConfig.create(config => {
  // ----------------------------------------------------------------------
  // 1. Create a config file for naming conventions
  // ----------------------------------------------------------------------

  const jobMatrix = new JobMaxtrix({
    env: {
      org: 'thadaw',
      project: 'wmgr',
      project_short: 'twmr',
      environment: `atom-${config.environmentSpecifier}`,
      environment_short: `a-${config.environmentSpecifier}`,
    },
    credential: {
      type: 'github_secret',
      gh_secret_name: 'AZURE_CREDENTIAL_RG__ATOM',
    },
    enableJobs: config.enableJobs,
  });

  const tenantConfig = {
    subscriptionId: Subscription['My Subscription'],
    resourceGroup: 'rg-wmgr-atom',
  };

  jobMatrix.addCommonScope(tenantConfig);
  jobMatrix.addTenants(config.enableTenants, {
    tenantConfig,
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
   * Override the storage account name because in Atom ,
   * we use the same storage account for all tenants
   */
  jobMatrix.config.react = jobMatrix.config.react.map(job => ({
    ...job,
    storage_account_name: 'twmrdataatomfile',
  }));

  const overrideDbMigration: Scope[] = ['contractor', 'utility_ccc', 'utility_bbb', 'utility_aaa'];
  overrideDbMigration.forEach(scope => {
    jobMatrix.overrideJobConfigs('db_migration', scope, {
      credential: {
        gh_secret_name: 'ATOM_SQL_SERVER_PASSWORD',
        type: 'github_secret',
      },
      server: 'thadawwmgr-atom-db-server',
    });
  });

  return jobMatrix.config;
});
