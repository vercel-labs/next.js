import { GAIN } from "../shared.js";

class GainProcessor extends AudioWorkletProcessor {
  process(inputs, outputs) {
    const out = outputs[0];
    for (const ch of out) ch.fill(GAIN);
    return true;
  }
}

registerProcessor("gain-processor", GainProcessor);
