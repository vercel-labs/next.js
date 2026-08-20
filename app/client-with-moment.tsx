"use client";
import moment from "moment";

export default function ClientWithMoment() {
  const CONSTANT = "MOMENT_CC_FINGERPRINT";
  return <p>{CONSTANT} {moment().format()}</p>;
}
