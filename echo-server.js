const net = require("node:net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => socket.write(data));
});

server.listen(process.env.ECHO_PORT || 3901, () => {
  console.log("echo server up on", server.address().port);
});
