import { JobSettings } from './types';

export const jobSettings: JobSettings = {
  web: {
    scopeType: 'tenant',
  },
  mobile_api: {
    scopeType: 'tenant',
  },
  api: {
    scopeType: 'tenant',
  },
  identityserver: {
    scopeType: 'tenant',
  },
  background_job: {
    scopeType: 'tenant',
  },
  db_migration: {
    scopeType: 'tenant',
  },
  // --------- TechStack with React --------------
  bff: {
    scopeType: 'tenant',
  },
  facing: {
    scopeType: 'tenant',
  },
  react: {
    scopeType: 'tenant',
  },
  // --------- TechStack with Realtime Module ------
  tunnel: {
    scopeType: 'tenant',
  },
  realtime_msg_center: {
    scopeType: 'tenant',
  },
  // ----------------- Common -----------------
  service_discovery: {
    scopeType: 'common',
  },
  auth_gateway: {
    scopeType: 'common',
  },
};
