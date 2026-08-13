const { execFileSync } = require('child_process');
const path = require('path');

const evalRoot = path.resolve(__dirname, '..');
const promptfoo = path.join(
  evalRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'promptfoo.cmd' : 'promptfoo',
);
const sharedEnv = {
  ...process.env,
  PROMPTFOO_DISABLE_TELEMETRY: '1',
};

function run(name, config) {
  console.log('\n==> ' + name);
  execFileSync(promptfoo, ['eval', '-c', config, '--no-cache'], {
    cwd: evalRoot,
    env: sharedEnv,
    stdio: 'inherit',
  });
}

run('R01 judge calibration', 'promptfooconfig.source-overreach.yaml');
run('R01 production-skill behavior', 'promptfooconfig.source-overreach-generate.yaml');
