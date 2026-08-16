// Mimics the `keepNames` helper that esbuild/tsup emit and that packages such as
// `@radix-ui/react-scroll-area` ship as-is.
const __name = (fn, name) =>
  Object.defineProperty(fn, 'name', { value: name, configurable: true })

// The return value of the `/* @__PURE__ */` annotated `__name(...)` call is
// invoked separately, and that invocation has side effects that must be kept.
export function startTicking(onTick) {
  let ticks = 0

  ;(/* @__PURE__ */ __name(function tick() {
    ticks += 1
    onTick(ticks)
  }, 'tick'))()

  return ticks
}
