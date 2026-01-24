export default {
  "*.{js,mjs,ts}": ["eslint --fix", "prettier --write", "vitest related --run"],
  "*.{html,json,md,css,scss}": ["prettier --write"]
};
