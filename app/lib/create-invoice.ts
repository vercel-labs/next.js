import { parentPort } from 'worker_threads'

parentPort?.on('message', async () => {
  console.log("HELLO I'M WORKER")
})
