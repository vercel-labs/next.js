"use strict";
// This file emulates what `tsc` emits for packages/ui-fonts/src-fonts.ts,
// i.e. a pre-compiled CJS file inside a workspace package that calls next/font.
Object.defineProperty(exports, "__esModule", { value: true });
exports.oxanium = exports.oxaniumLocal = void 0;
const local_1 = require("next/font/local");
const google_1 = require("next/font/google");
exports.oxaniumLocal = (0, local_1.default)({ src: "./oxanium.ttf", display: "swap" });
exports.oxanium = (0, google_1.Oxanium)({ subsets: ["latin"] });
