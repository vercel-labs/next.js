import path from 'path'

const __dirname = import.meta.dirname

const nextConfig = {
  sassOptions: {
    // Reporter's config. Ignored by Next 16 (modern Sass API) under BOTH
    // Turbopack and --webpack. Renaming this to `loadPaths` makes case 3 pass
    // on both bundlers.
    includePaths: [path.join(__dirname, 'src'), path.join(__dirname, 'src/styles')],
    // loadPaths: [path.join(__dirname, 'src'), path.join(__dirname, 'src/styles')],
  },
}

export default nextConfig
