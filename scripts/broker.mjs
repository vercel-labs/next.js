// Minimal local MQTT-over-WebSocket broker so the repro needs no public broker.
import { createServer } from "node:http";
import Aedes from "aedes";
import { WebSocketServer, createWebSocketStream } from "ws";

const aedes = new Aedes();
const http = createServer();
const wss = new WebSocketServer({ server: http });

wss.on("connection", (ws) => {
  const stream = createWebSocketStream(ws);
  aedes.handle(stream);
});

aedes.on("client", (c) => console.log("[broker] client connected:", c.id));
aedes.on("clientDisconnect", (c) => console.log("[broker] client disconnected:", c.id));
aedes.on("publish", (packet, client) => {
  if (client) {
    console.log(
      `[broker] publish from ${client.id} topic=${packet.topic} payload=${packet.payload}`,
    );
  }
});

http.listen(1884, () => console.log("[broker] listening on ws://127.0.0.1:1884"));
