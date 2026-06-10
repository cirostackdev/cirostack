// This custom server is no longer required.
// Real-time chat now uses Pusher (hosted WebSockets) instead of Socket.io.
// Use `next dev` or `next start` directly — no custom server needed.
//
// Keeping this file for reference / local dev overrides only.

import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal server error");
    }
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port} (${dev ? "dev" : "prod"})`);
  });
});
