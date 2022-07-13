module.exports = {
  extends: [
    'plugin:playwright/playwright-test',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'vacuumlabs',
    'prettier',
  ],
  env: {
    node: true,
    'jest/globals': true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': [
      'error',
      {
        ignoreRestArgs: true,
      },
    ],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
    // note you must disable the base rule as it can report incorrect errors
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    // Why detect cycles: https://spin.atomicobject.com/2018/06/25/circular-dependencies-javascript
    // TLDR - memory crashes, tangled architecture, unreadable code, undefined imports
    'import/no-cycle': [
      'error',
      {
        // Without cutoff, this rule takes up >75% overall lint time
        // Run fully only on circleCI
        ...(!process.env.CI && {maxDepth: 5}),
      },
    ],
    'import/no-extraneous-dependencies': ['error'],
    'react-hooks/rules-of-hooks': 'error',

    // We often specify async functions in interfaces "just in case" the
    // implementation does actually need to do some asynchronous processing.
    // Many implementations of such interfaces on the other hand do not require
    // any async calls. There are other ways to comply with the interface, such
    // as wrapping all return values of the function in `Promise.resolve`, but
    // by far the most convenient solution is to simply mark the function as
    // `async`, without actually using any `await` keywords inside. Because of
    // this, `async` functions without `await` are often a legitimate use-case
    // for us, and this warning gets in the way more often than it actually
    // helps.
    'require-await': 'off',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  plugins: ['jest', 'import', 'react-hooks'],
  // Recommended, when using TS with eslint
  // One of the reason is that eslint does not complain about JSX types
  // https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
}
