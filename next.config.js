/** @type {import('next').NextConfig} */
module.exports = {
  // Workaround: without this, Turbopack externalizes @mui/material-nextjs on the
  // server, giving it a separate @emotion/react instance than the bundled one used
  // by @mui/material, so the AppCacheProvider (key: 'mui') is ignored during SSR.
  // transpilePackages: ['@mui/material-nextjs'],
};
