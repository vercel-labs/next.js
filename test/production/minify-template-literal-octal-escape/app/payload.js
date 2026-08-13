// Stand-in for real-world packages (e.g. Cesium) that inline WASM binaries
// into a template literal.
//
// The template literal contains a raw newline, so the minifier keeps it a
// template literal, and a `\x00` escape that is directly followed by a digit.
// Re-emitting that escape as `\0` produces `\00`, which is an octal escape and
// therefore a SyntaxError inside a template literal.
export const payload = `first line
second line\x000\x001`
