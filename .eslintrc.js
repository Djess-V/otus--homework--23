module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "airbnb-base",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react/recommended",
    "prettier",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["jest", "@typescript-eslint", "react"],
  ignorePatterns: ["**/dist/**"],
  rules: {
    "import/extensions": ["warn", { css: "never", ts: "never", tsx: "never" }],
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": [
      "error",
      {
        packageDir: __dirname,
      },
    ],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "no-param-reassign": "off",
    "no-restricted-syntax": "off",
    "no-console": "off",
    "no-await-in-loop": "off",
    "prefer-destructuring": ["error", { object: true, array: false }],
    "max-classes-per-file": ["error", { ignoreExpressions: true, max: 2 }],
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".ts", ".jsx", ".tsx", "*.css", ".d.ts"],
      },
    },
  },
};
