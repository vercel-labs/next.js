"use client";
import $ from "jquery";

export default function ClientWithJquery() {
  const CONSTANT = "JQUERY_CC_FINGERPRINT";
  return <p onClick={() => $("body")}>{CONSTANT}</p>;
}
