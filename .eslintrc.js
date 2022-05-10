module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'class-methods-use-this': [0, { exceptMethods: 'createKey' }],
    'import/extensions': [0, { js: 'never' }],
  },
};
