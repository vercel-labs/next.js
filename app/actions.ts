"use server";

import { sleep } from "./utils";

export async function testAction() {
  console.log("test action");

  await sleep(1000);

  console.log("done");

  return { randomNumber: Math.random() };
}
