module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'indent': ['error', 4, { 'SwitchCase': 1 }],
    'quotes': ['error', 'single', { "allowTemplateLiterals": true }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    '@typescript-eslint/typedef': [
      'error',
      {
        'variableDeclaration': true,
        'arrayDestructuring': true,
        'memberVariableDeclaration': true,
        'objectDestructuring': false,
        'parameter': false,
        'propertyDeclaration': true,
        'variableDeclarationIgnoreFunction': true,
        'arrowParameter': false,
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
        overrides: {
          constructors: 'no-public',
        },
      },
    ],
  },
};
