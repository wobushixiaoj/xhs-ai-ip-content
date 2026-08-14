const {
  loadLocalEnv,
  runNode,
  validateWorkspace,
  workspaceFromArgs,
} = require('./regression-utils');

loadLocalEnv();
const workspace = validateWorkspace(workspaceFromArgs(process.argv.slice(2)));
const workspaceArgs = ['--workspace', workspace];

runNode('verify-workspace-agent.js', workspaceArgs);
runNode('run-skill-regression.js');
runNode('run-agent-baseline-regression.js', workspaceArgs);
