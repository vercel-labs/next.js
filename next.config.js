/** Emits a webpack asset at `myasset/test.txt` during compilation. */
class EmitAssetPlugin {
  apply(compiler) {
    const { webpack } = compiler;
    compiler.hooks.thisCompilation.tap('EmitAssetPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'EmitAssetPlugin',
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets) => {
          assets['myasset/test.txt'] = new webpack.sources.RawSource(
            'hello from webpack emitted asset\n'
          );
        }
      );
    });
  }
}

module.exports = {
  webpack: (config) => {
    config.plugins.push(new EmitAssetPlugin());
    return config;
  },
};
