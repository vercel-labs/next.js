# Repro: next#66880 — FOUC/flicker with react-native-web in App Router

Server HTML contains react-native-web atomic class names (`css-view-*`, `r-*`) but no
`<style id="react-native-stylesheet">`, because react-native-web only injects its
StyleSheet on the client. The page therefore paints completely unstyled until the
client bundle hydrates, then snaps into place (flicker).

In Next 12 / pages router this was avoidable via `pages/_document` +
`AppRegistry.getApplication()` to inline the stylesheet; the App Router has no
equivalent server hook.

## Run

```bash
npm install
npm run dev     # or: npm run build && npm run start
# open http://localhost:3000
curl -s http://localhost:3000 | grep -c 'react-native-stylesheet'   # -> 0
curl -s http://localhost:3000 | grep -o 'class="css-view[^"]*"'      # -> classes with no CSS
```

Throttle the network (or view with JS disabled) to see the unstyled paint.
