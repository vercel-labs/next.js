"use client";

// Copy of examples/with-mqtt-js/app/page.tsx, plus:
//  - the connected client is stored in a module-level store (as any app would
//    do to reuse it on other pages)
//  - a <Link> to a second page
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { MqttClient } from "mqtt";
import useMqtt from "@/lib/useMqtt";
import { setSharedClient, getSharedClient } from "@/lib/sharedClient";

export default function Home() {
  const [incomingMessages, setIncomingMessages] = useState<any[]>([]);
  const addMessage = (message: any) => {
    setIncomingMessages((incomingMessages) => [...incomingMessages, message]);
  };

  const incomingMessageHandlers = useRef([
    {
      topic: "topic1",
      handler: (msg: string) => {
        addMessage(msg);
      },
    },
  ]);

  const mqttClientRef = useRef<MqttClient | null>(null);
  const setMqttClient = (client: MqttClient) => {
    mqttClientRef.current = client;
    setSharedClient(client);
  };
  useMqtt({
    uri: process.env.NEXT_PUBLIC_MQTT_URI,
    options: {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
      clientId: process.env.NEXT_PUBLIC_MQTT_CLIENTID,
    },
    topicHandlers: incomingMessageHandlers.current,
    onConnectedHandler: (client) => setMqttClient(client),
  });

  const [status, setStatus] = useState("(no client)");
  useEffect(() => {
    const t = setInterval(() => {
      const c = getSharedClient();
      setStatus(
        c
          ? `shared client: connected=${c.connected} disconnected=${c.disconnected} disconnecting=${c.disconnecting}`
          : "(no client)",
      );
    }, 300);
    return () => clearInterval(t);
  }, []);

  const publishMessages = (client: any) => {
    if (!client) {
      console.log("(publishMessages) Cannot publish, mqttClient: ", client);
      return;
    }
    client.publish("topic1", "1st message from component");
  };

  return (
    <div>
      <h2>Home (example page)</h2>
      <p id="home-messages-count">messages: {incomingMessages.length}</p>
      <p id="home-client-state">{status}</p>
      {incomingMessages.map((m, i) => (
        <p key={i}>{m.payload.toString()}</p>
      ))}
      <button id="publish" onClick={() => publishMessages(mqttClientRef.current)}>
        Publish Test Messages
      </button>
      <p>
        <Link id="to-other" href="/other">
          Go to /other
        </Link>
      </p>
    </div>
  );
}
