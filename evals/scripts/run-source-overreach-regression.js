const { loadLocalEnv, runPromptfoo } = require('./regression-utils');

loadLocalEnv();
runPromptfoo('R01 judge calibration', 'promptfooconfig.source-overreach.yaml');
runPromptfoo('R01 production-skill behavior', 'promptfooconfig.source-overreach-generate.yaml');
