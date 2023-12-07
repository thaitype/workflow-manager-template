import { DefaultAzureCredential } from '@azure/identity';
import { AzureAppService } from '../../vendors';
import { Subscription } from '../../libs';

export async function main() {
  const credential = new DefaultAzureCredential();
  const publishProfile = await new AzureAppService(credential).listPublishProfile({
    subscriptionId: Subscription['My Subscription'],
    appName: 'thadawwmgr-dev-utility-ccc-rt-msg',
    resourceGroup: 'rg-wmgr-dev',
  });
  // await fs.writeFile('publishProfile.xml', publishProfile);
}

main();
