import { GAIN } from "../shared.js";

self.onmessage = () => {
  self.postMessage("worker sees GAIN=" + GAIN);
};
