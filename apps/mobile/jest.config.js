/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // pnpm's nested .pnpm store means every dependency path contains more
  // than one "node_modules" segment, which breaks the usual
  // "node_modules/(?!allowlist)" transformIgnorePatterns trick (it matches
  // on the first, irrelevant segment). Transforming everything is the
  // simplest correct fix at this project's size.
  transformIgnorePatterns: [],
};
