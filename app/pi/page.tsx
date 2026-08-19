"use client";
import { html } from "property-information";
export default function P() {
  return <pre id="out">{JSON.stringify({ allowFullScreen: html.property.allowFullScreen, keys: Object.keys(html.property).length })}</pre>;
}
