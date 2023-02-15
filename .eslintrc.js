module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
        "airbnb-typescript-base",
        "eslint: recommended",
        "plugin: @typescript-eslint/recommended",
        "plugin: prettier/recommended"],
    parserOptions: {
      ecmaVersion: 13,
      sourceType: "module",
    },
    rules: {},
  };