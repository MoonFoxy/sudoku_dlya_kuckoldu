import { resolve } from 'path';

/** @type { import('vls').VeturConfig } */
module.exports = {
  // **optional** default: `{}`
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'typescript.tsdk': resolve(__dirname, '.yarn/sdks/typescript/bin'),
  },
};
