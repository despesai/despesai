import { Linter } from "eslint";

const configs: Linter.BaseConfig = {
  extends: ["@rocketseat/eslint-config/node"],
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
  },
};

export default configs;
