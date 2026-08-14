const {
  loadLocalEnv,
  runPromptfoo,
  validateWorkspace,
  workspaceFromArgs,
} = require('./regression-utils');

loadLocalEnv();
const workspace = validateWorkspace(workspaceFromArgs(process.argv.slice(2)));
runPromptfoo('Workspace AGENT baseline behavior', 'promptfooconfig.agent-baseline.yaml', {
  cwd: workspace,
});
