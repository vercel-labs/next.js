// TCP proxy 3100 -> 3000. Sending SIGUSR2 destroys all live sockets while the
// listener stays up: emulates a laptop suspend dropping in-flight connections
// (Chrome's net::ERR_NETWORK_IO_SUSPENDED) without touching the dev server.
import net from 'node:net';

const live = new Set();
const server = net.createServer((client) => {
  const upstream = net.connect(3000, '127.0.0.1');
  live.add(client); live.add(upstream);
  client.pipe(upstream); upstream.pipe(client);
  const bye = () => { live.delete(client); live.delete(upstream); client.destroy(); upstream.destroy(); };
  client.on('error', bye); upstream.on('error', bye);
  client.on('close', bye); upstream.on('close', bye);
});
server.listen(3100, () => console.log('proxy listening on 3100 pid', process.pid));
process.on('SIGUSR2', () => {
  console.log('SUSPEND: destroying', live.size, 'sockets');
  for (const s of live) s.destroy();
  live.clear();
});
