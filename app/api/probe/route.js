import net from "node:net";

function probeRawSocket(port) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: "127.0.0.1", port }, () => {
      socket.write("ping");
    });
    socket.on("data", (data) => {
      socket.end();
      resolve(data.toString());
    });
    socket.on("error", reject);
  });
}

export async function GET() {
  const start = Date.now();
  const reply = await probeRawSocket(Number(process.env.ECHO_PORT));
  return Response.json({ reply, ms: Date.now() - start });
}
