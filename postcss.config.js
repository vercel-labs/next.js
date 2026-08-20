import postcssPresetEnv from 'postcss-preset-env'

const config = {
  plugins: [
    postcssPresetEnv({ stage: 2, features: { 'nesting-rules': false } }),
  ],
}

export default config
