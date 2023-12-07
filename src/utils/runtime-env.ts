/**
 * Whether the workflow is running in development mode.
 * Please set the environment variable WORKFLOW_ENV=development in order to read all properties.
 *
 * Avoid calling `process.env.WORKFLOW_ENV` directly
 *
 * @returns
 */

export function isWorkflowDevelopment() {
  const developmentMode = 'development';
  const workflowEnv = process.env.WORKFLOW_ENV === undefined ? developmentMode : process.env.WORKFLOW_ENV;
  console.log('Running on Workflow environemt: ', workflowEnv);
  return workflowEnv === developmentMode;
}

/**
 * Validate the workflow environment
 * If the workflow is not running in development mode, exit the process
 */
export function validateWorkflowEnv() {
  if (!isWorkflowDevelopment()) {
    console.log('Not running on development environment, skip setting up secret');
    process.exit(0);
  }
}
