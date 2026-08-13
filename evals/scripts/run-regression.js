const { execFileSync } = require('child_process');
const path = require('path');

const evalRoot = path.resolve(__dirname, '..');
const runner = path.join(evalRoot, 'scripts', 'run-source-overreach-regression.js');

execFileSync(process.execPath, [runner], {
  cwd: evalRoot,
  env: {
    ...process.env,
    PROMPTFOO_DISABLE_TELEMETRY: '1',
  },
  stdio: 'inherit',
});
