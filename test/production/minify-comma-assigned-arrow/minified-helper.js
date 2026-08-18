// Emulates already-minified third-party code (e.g. superdoc) where helpers are
// assigned through a single comma expression. The minifier used to inline
// `join` into the nested arrow, producing `a => b => { let b, c; ... }`, which
// is invalid JavaScript.
var join, run
;((join = (e, t) => e + t),
  (run = (rows) => {
    rows.map((s) => join(s.g, s.r))
    return rows.map((s) => (i) => join(s.g, i.l))
  }))
export { run }
