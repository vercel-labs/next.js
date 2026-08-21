# Reproduction: Next.js sends telemetry on `next dev` without opt-in (issue #94475)

Minimal App Router app (Next.js 16.3.1). Demonstrates that on a first run the CLI prints the
telemetry notice **and** posts payloads to `https://telemetry.nextjs.org/api/v1/record`
without any prior consent.

## Run

```bash
npm install
rm -rf ~/.config/nextjs-nodejs   # simulate a fresh machine (Linux path)
NODE_OPTIONS="--require ./tools/intercept-telemetry.js" npx next dev
# in another shell: curl -s -o /dev/null http://localhost:3000/ ; then Ctrl-C the dev server
cat telemetry-intercept.log
```

`tools/intercept-telemetry.js` only logs the outbound telemetry request (URL + body) and forwards it.

## Observed

- Notice printed once, after the server is already up.
- `NEXT_CLI_SESSION_STARTED` and `NEXT_BUILD_FEATURE_USAGE` posted from `start-server.js`,
  plus a detached `telemetry/detached-flush.js` process posting on exit.
- Payload contains persistent `anonymousId`, `projectId`, `sessionId` and machine metadata
  (platform, kernel release, arch, CPU model/count, memory, isDocker/isWsl/isCI, versions).
- Persistent identifier + salt stored in `~/.config/nextjs-nodejs/config.json`.
- Replaying a captured payload against the real endpoint returns `204 No Content`.
- With `NEXT_TELEMETRY_DISABLED=1`: zero requests (opt-out works, but it is opt-out, not opt-in).
