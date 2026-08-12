const reproNoopPlugin = {
  postcssPlugin: "turbopack-nul-env-repro-noop",
  Once() {},
};

export default {
  plugins: [reproNoopPlugin],
};
