export default function Home() {
  //
  // 1. Close laptop or put device to sleep.
  // 2. Open laptop or resume device.
  // 3. Try editing text below and observe no hot reload.
  //
  // Happens in Chrome Version 133.0.6943.142 (Official Build) (arm64).
  // Does not happen in Firefox 135.0.1 (aarch64).
  //
  // Happens in webpack and turbopack.
  //
  return <div>Hello, world!!</div>;
}
