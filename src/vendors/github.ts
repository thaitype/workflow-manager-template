import { execa, Options as ExecaOption } from 'execa';

export interface GithubSecretConfig {
  secretName: string;
  secretValue: string;
  /**
   * Select another repository using the [HOST/]OWNER/REPO format
   */
  repo?: string;
}

export async function setGithubSecret(
  config: GithubSecretConfig,
  option?: {
    extraArgs?: string[];
    execaOption?: ExecaOption;
  }
) {
  const repo: string[] = config.repo ? ['--repo', config.repo] : [];
  const extraArgs: string[] = option?.extraArgs ?? [];
  const { stdout } = await execa(
    'gh',
    ['secret', 'set', config.secretName, '-b', config.secretValue, ...repo, ...extraArgs],
    option?.execaOption
  );
  return stdout;
}
