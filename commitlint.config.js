// Using static import to avoid the "Top-Level Await" require error
import scopeMultiPlugin from './commitlint-plugin-scope-multi.js';

const validScopes = [
  'cli',
  'docs',
  'api',
  'queue',
  'cache',
  'db',
  'core',
  'ui',
];

const config = {
  extends: ['@commitlint/config-conventional'],
  plugins: [scopeMultiPlugin],
  rules: {
    'scope-enum': [0],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-multi-enum': [2, 'always', validScopes],
  },
  ignores: [message => message.includes('[skip-commitlint]')],
};

export default config;
