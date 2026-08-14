const { loadLocalEnv, runPromptfoo } = require('./regression-utils');

loadLocalEnv();

runPromptfoo('R01 judge calibration', 'promptfooconfig.source-overreach.yaml');
runPromptfoo('R01 production-skill behavior', 'promptfooconfig.source-overreach-generate.yaml');
runPromptfoo('R02/R03 judge calibration', 'promptfooconfig.reading-dependency.yaml');
runPromptfoo('R02/R03 production-skill behavior', 'promptfooconfig.reading-dependency-generate.yaml');
runPromptfoo('R04 carousel prompt judge calibration', 'promptfooconfig.carousel-prompt.yaml');
runPromptfoo('R04 carousel prompt behavior', 'promptfooconfig.carousel-prompt-generate.yaml');
