// A plain CommonJS npm package that renders next/image, like
// @sitecore-jss/sitecore-jss-nextjs does. Because it stays *external* in the
// pages server build, `process.env.__NEXT_IMAGE_OPTS` is never inlined into
// next/dist/client/image-component.js, so next/image falls back to
// ImageConfigContext -- which on Vercel is the DEEP FROZEN config coming from
// required-server-files.json (loadManifest -> deepFreeze).
const React = require('react')
const Image = require('next/image').default

exports.PkgImage = function PkgImage(props) {
  return React.createElement(Image, props)
}
