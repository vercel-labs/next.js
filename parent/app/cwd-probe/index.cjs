// PostCSS plugin that reports the worker's cwd and whether `tailwindcss`
// resolves from it. Issue #98023 claims cwd is the ancestor directory.
module.exports = () => {
  console.error('POSTCSS_WORKER_CWD=' + process.cwd())
  try {
    console.error(
      'RESOLVE_TAILWIND_FROM_CWD=' +
        require.resolve('tailwindcss', { paths: [process.cwd()] })
    )
  } catch (e) {
    console.error('RESOLVE_TAILWIND_FROM_CWD_FAILED=' + e.message.split('\n')[0])
  }
  return { postcssPlugin: 'cwd-probe' }
}
module.exports.postcss = true
