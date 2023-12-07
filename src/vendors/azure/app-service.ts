import { WebSiteManagementClient, WebSiteManagementClientOptionalParams } from '@azure/arm-appservice';
import { DefaultAzureCredential } from '@azure/identity';

export class AzureAppService {
  constructor(private credential: DefaultAzureCredential) {}

  async listPublishProfile(
    config: { subscriptionId: string; resourceGroup: string; appName: string },
    option?: WebSiteManagementClientOptionalParams
  ): Promise<string> {
    const appServiceClient = new WebSiteManagementClient(this.credential, config.subscriptionId, option);
    const { readableStreamBody } = await appServiceClient.webApps.listPublishingProfileXmlWithSecrets(
      config.resourceGroup,
      config.appName,
      {}
    );
    if (!readableStreamBody) {
      throw new Error('Failed to get publish profile');
    }
    const publishProfiles = readableStreamBody.read();
    if (typeof publishProfiles !== 'string') return publishProfiles.toString();
    return publishProfiles;
  }
}