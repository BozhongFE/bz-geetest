module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    initGeetest: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "no-console": 0,
    "no-alert": 0,
    "no-unused-expressions": [2, {
      "allowShortCircuit": true
    }],
    "no-underscore-dangle": 0,
    "linebreak-style": 0
  },
};
