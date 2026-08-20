# next dev --experimental-https requires root/sudo (issue #74061)

`next dev --experimental-https` always runs `mkcert -install`, which writes the mkcert
root CA into the **system** trust store. That step needs elevated privileges, so Next.js
either prompts for a sudo password or (when sudo is unavailable / non-interactive)
fails and **silently falls back to plain HTTP** while still printing the normal dev banner.

Source: `packages/next/src/lib/mkcert.ts` -> `execSync('"<mkcert>" -install -key-file ... -cert-file ... <hosts>', { stdio: 'ignore' })`

## Run

```bash
npm install
# as a non-root user WITHOUT passwordless sudo:
npm run repro
```

## Observed (next@16.3.1-canary.25, also 15.1.0)

```
 ⚠ Self-signed certificates are currently an experimental feature, use with caution.
   Attempting to generate self signed certificate. This may prompt for your password
 ⨯ Failed to generate self-signed certificate. Falling back to http. Error: Command failed:
   ".cache/mkcert/mkcert-v1.4.4-linux-amd64" -install -key-file ... -cert-file ... localhost 127.0.0.1 ::1
   ▲ Next.js 16.3.1-canary.25 (Turbopack)
   - Local:  http://localhost:3100
http  -> 200
https -> 000
```

The same mkcert binary invoked *without* `-install` creates key + cert successfully as an
unprivileged user, so only the trust-store installation needs privileges:

```
Created a new certificate valid for the following names 📜
 - "localhost" - "127.0.0.1" - "::1"
```

## Expected

Certificate generation should not require sudo/root; `-install` should be optional
(e.g. skipped or opt-in), and failure to install the CA should not silently downgrade
`--experimental-https` to HTTP.

Workaround: pass your own cert with
`next dev --experimental-https-key ./key.pem --experimental-https-cert ./cert.pem`.
