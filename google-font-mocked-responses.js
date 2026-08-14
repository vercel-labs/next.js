// Mocked Google Fonts stylesheet responses, the same mechanism Next.js' own
// e2e tests use (NEXT_FONT_GOOGLE_MOCKED_RESPONSES).
//
// The CSS below is the *real* response fonts.googleapis.com/css2 returned for
// this family, except that the `src:` URLs are the ones fonts.gstatic.com has
// already rotated away (they return HTTP 404 today, verify with curl -I).
// This is exactly the state a build lands in when it receives a stale
// stylesheet from the Google Fonts CDN: a valid stylesheet pointing at font
// files that no longer exist.
const DEAD_404_URL =
  'https://fonts.gstatic.com/s/notoserif/v33/ga63aw1J5X9T9RW6j9bNVls-hfgvz8JcMofYTa32J4wsL2JAlAhZqFDBy-_7XjNxySgjDY7sQsdB3SHmQLqNQw.woff2'

module.exports = {
  'https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400&display=swap': `
/* latin */
@font-face {
  font-family: 'Noto Serif';
  font-style: normal;
  font-weight: 400;
  font-stretch: 100%;
  font-display: swap;
  src: url(${DEAD_404_URL}) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`,
}
