const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const evalRoot = path.resolve(__dirname, '..');

function loadLocalEnv() {
  const envPath = path.join(evalRoot, '.env.local');
  if (!fs.existsSync(envPath)) return;

  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

function workspaceFromArgs(args) {
  const index = args.indexOf('--workspace');
  if (index === -1) return process.env.XHS_EVAL_WORKSPACE;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error('--workspace 必须后接一个工作区路径。');
  }
  return value;
}

function validateWorkspace(workspacePath) {
  if (!workspacePath) {
    throw new Error(
      '完整回归需要真实工作区路径。请在 evals/.env.local 设置 XHS_EVAL_WORKSPACE，或传入 --workspace <路径>。',
    );
  }

  const resolved = path.resolve(workspacePath);
  const agentPath = path.join(resolved, 'AGENTS.md');
  if (!fs.statSync(resolved, { throwIfNoEntry: false })?.isDirectory()) {
    throw new Error('XHS_EVAL_WORKSPACE 不是可访问目录：' + resolved);
  }
  if (!fs.statSync(agentPath, { throwIfNoEntry: false })?.isFile()) {
    throw new Error('工作区缺少实际 AGENTS.md：' + agentPath);
  }
  return resolved;
}

function promptfooPath() {
  return path.join(
    evalRoot,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'promptfoo.cmd' : 'promptfoo',
  );
}

function renderedConfig(configName) {
  const sourcePath = path.join(evalRoot, configName);
  const model = String(process.env.XHS_EVAL_MODEL || '').trim();
  if (!model) return { path: sourcePath, cleanup: () => {} };

  const marker = '      # XHS_EVAL_MODEL';
  const source = fs.readFileSync(sourcePath, 'utf8');
  if (!source.includes(marker)) {
    throw new Error('配置缺少 XHS_EVAL_MODEL 占位符：' + sourcePath);
  }

  const temporaryPath = path.join(
    evalRoot,
    '.eval-config-' + process.pid + '-' + Date.now() + '-' + path.basename(configName),
  );
  fs.writeFileSync(temporaryPath, source.replace(marker, '      model: ' + JSON.stringify(model)));
  return {
    path: temporaryPath,
    cleanup: () => fs.rmSync(temporaryPath, { force: true }),
  };
}

function runPromptfoo(name, configName, options = {}) {
  const config = renderedConfig(configName);
  const env = {
    ...process.env,
    PROMPTFOO_DISABLE_TELEMETRY: '1',
  };
  console.log('\n==> ' + name);
  try {
    execFileSync(promptfooPath(), ['eval', '-c', config.path, '--no-cache'], {
      cwd: options.cwd || evalRoot,
      env,
      stdio: 'inherit',
    });
  } finally {
    config.cleanup();
  }
}

function runNode(scriptName, args = []) {
  execFileSync(process.execPath, [path.join(evalRoot, 'scripts', scriptName), ...args], {
    cwd: evalRoot,
    env: {
      ...process.env,
      PROMPTFOO_DISABLE_TELEMETRY: '1',
    },
    stdio: 'inherit',
  });
}

module.exports = {
  evalRoot,
  loadLocalEnv,
  runNode,
  runPromptfoo,
  validateWorkspace,
  workspaceFromArgs,
};
