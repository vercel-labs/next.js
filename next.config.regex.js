/** @type {import('next').NextConfig} */
module.exports = {
  modularizeImports: {
    '@some/library': {
      // The reporter's desired pattern: one transform covering several
      // directories inside the package. modularizeImports only accepts a
      // single string template, so this is emitted verbatim.
      transform: '@some/library/dist/(components|hooks|utils)/{{member}}',
    },
  },
}
