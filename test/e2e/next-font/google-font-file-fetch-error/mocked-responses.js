// The stylesheet is mocked, but the font file it points at is not: it is served
// from a port nothing listens on, so downloading the font file always fails.
// See google-font-file-fetch-error.test.ts.
module.exports = {
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap': `
/* latin */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(http://127.0.0.1:1/roboto-this-font-file-cannot-be-downloaded.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}
`,
}
