import * as wasm from '../../wasm/add.wasm'

export default function handler(req, res) {
  res.json({ result: wasm.add_one(1) })
}
