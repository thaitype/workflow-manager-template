import { JobMaxtrix } from '../../src/libs';
import configGenerator from '../../src/configs/deploy-dev';

describe('Deploy Dev  Config', () => {

  it('Dev  Name should be correct', async () => {
    const config = await configGenerator({
      ENABLE_CONTRACTOR: 'true',
      ENABLE_UTILITY_AAA: 'true',
      ENABLE_UTILITY_CCC: 'true',
      ENABLE_UTILITY_BBB: 'true',
      ENABLE_UTILITY_DEMO: 'false', // This value must be defined
      ENABLE_JOB_REACT: 'true',
      ENABLE_JOB_BFF: 'true',
      ENABLE_JOB_FACING: 'true',
      ENABLE_JOB_REALTIME_MSG_CENTER: 'true',
      ENABLE_JOB_TUNNEL: 'true',
      ENABLE_JOB_WEB: 'true',
      ENABLE_JOB_API: 'true',
      ENABLE_JOB_MOBILE_API: 'true',
      ENABLE_JOB_IDENTITYSERVER: 'true',
      ENABLE_JOB_AUTH_GATEWAY: 'true',
      ENABLE_JOB_SERVICE_DISCOVERY: 'true',
      ENABLE_JOB_BACKGROUND_JOB: 'true',
      ENABLE_JOB_DB_MIGRATION: 'true',
    });
    expect(
      new Set([
        'container_app.twmr_dev_ctr_bff',
        'container_app.twmr_dev_ctr_fac',
        'container_app.twmr_dev_ctr_tun',
        'container_app.twmr_dev_ccc_bff',
        'container_app.twmr_dev_ccc_fac',
        'container_app.twmr_dev_ccc_tun',
        'container_app.twmr_dev_bbb_bff',
        'container_app.twmr_dev_bbb_fac',
        'container_app.twmr_dev_bbb_tun',
        'container_app.twmr_dev__bff',
        'container_app.twmr_dev__fac',
        'container_app.twmr_dev__tun',
        'function_app.thadawwmgr_dev_contractor_rt_msg',
        'function_app.thadawwmgr_dev_utility_ccc_background',
        'function_app.thadawwmgr_dev_utility_ccc_rt_msg',
        'function_app.thadawwmgr_dev_utility_bbb_background',
        'function_app.thadawwmgr_dev_utility_bbb_rt_msg',
        'function_app.thadawwmgr_dev_utility_aaa_background',
        'function_app.thadawwmgr_dev_utility_aaa_rt_msg',
        'react.twmrdatadevcontrfile',
        'react.twmrdatadevcccfile',
        'react.twmrdatadevbbbfile',
        'react.twmrdatadevfile',
        'sql_database.wmgr_dev_contractor',
        'sql_database.wmgr_dev_utility_ccc',
        'sql_database.wmgr_dev_utility_bbb',
        'sql_database.wmgr_dev_utility_aaa',
        'web_app.thadawwmgr_dev_contractor',
        'web_app.thadawwmgr_dev_contractor_api',
        'web_app.thadawwmgr_dev_contractor_identityserver',
        'web_app.thadawwmgr_dev_contractor_mobile_api',
        'web_app.thadawwmgr_dev_utility_ccc',
        'web_app.thadawwmgr_dev_utility_ccc_api',
        'web_app.thadawwmgr_dev_utility_ccc_identityserver',
        'web_app.thadawwmgr_dev_utility_ccc_mobile_api',
        'web_app.thadawwmgr_dev_utility_bbb',
        'web_app.thadawwmgr_dev_utility_bbb_api',
        'web_app.thadawwmgr_dev_utility_bbb_identityserver',
        'web_app.thadawwmgr_dev_utility_bbb_mobile_api',
        'web_app.thadawwmgr_dev_utility_aaa',
        'web_app.thadawwmgr_dev_utility_aaa_api',
        'web_app.thadawwmgr_dev_utility_aaa_identityserver',
        'web_app.thadawwmgr_dev_utility_aaa_mobile_api',
      ])
    ).toStrictEqual(JobMaxtrix.getIds(config));
  });
});
