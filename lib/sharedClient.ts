// Mimics what an app does when it wants to reuse the connection created by
// the example's `useMqtt` hook on other pages (context / module singleton).
import type { MqttClient } from "mqtt";

let shared: MqttClient | null = null;

export function setSharedClient(client: MqttClient) {
  shared = client;
}

export function getSharedClient() {
  return shared;
}
