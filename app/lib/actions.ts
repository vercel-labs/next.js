import { Worker } from 'worker_threads'

export async function createInvoice() {
  new Worker(new URL('./create-invoice.ts', import.meta.url))
}
