const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = Number(process.env.PORT) || 4000;
const app = next({ dev: false, hostname: "localhost", port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Expect every /_next/static asset in the HTML to be prefixed with this origin.
  app.setAssetPrefix("https://example.com/cdn");

  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    if (parsedUrl.pathname === "/") {
      await app.render(req, res, "/", parsedUrl.query);
    } else {
      await handle(req, res, parsedUrl);
    }
  }).listen(port, () => console.log(`> Ready on http://localhost:${port}`));
});
