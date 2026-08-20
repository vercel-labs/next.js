import * as wasm from '../../wasm/add.wasm'

export default function handler(req, res) {
  res.json({ sum: wasm.add(2, 3) })
}
