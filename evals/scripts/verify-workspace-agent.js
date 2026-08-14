const fs = require('fs');
const path = require('path');
const { loadLocalEnv, validateWorkspace, workspaceFromArgs } = require('./regression-utils');

loadLocalEnv();
const workspace = validateWorkspace(workspaceFromArgs(process.argv.slice(2)));
const agentPath = path.join(workspace, 'AGENTS.md');
const content = fs.readFileSync(agentPath, 'utf8');
const missing = ['xhs-ai-ip-content', 'imagegen'].filter((item) => !content.includes(item));
const legacyRoute = content.includes('xhs-carousel-image-production');

if (missing.length || legacyRoute) {
  const issues = [];
  if (missing.length) issues.push('缺少路由：' + missing.join(', '));
  if (legacyRoute) issues.push('仍路由到已归档的 xhs-carousel-image-production');
  throw new Error('工作区 AGENTS.md 路由合同失败：' + issues.join('；'));
}

console.log('Workspace AGENT route contract passed: ' + agentPath);
