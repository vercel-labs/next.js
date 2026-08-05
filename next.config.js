// Toggle to test: `SERVER_SOURCE_MAPS=false next build`
const flag = process.env.SERVER_SOURCE_MAPS
module.exports = {
  experimental:
    flag === undefined ? {} : { serverSourceMaps: flag === 'true' },
}
