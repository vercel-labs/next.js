"use client";

// A second page that wants to reuse the MQTT connection created on "/".
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSharedClient } from "@/lib/sharedClient";

export default function Other() {
  const [state, setState] = useState("(reading…)");
  const [publishResult, setPublishResult] = useState("(not tried)");

  useEffect(() => {
    const client = getSharedClient();
    setState(
      client
        ? `connected=${client.connected} disconnected=${client.disconnected} disconnecting=${client.disconnecting}`
        : "no shared client",
    );
  }, []);

  const publish = () => {
    const client = getSharedClient();
    if (!client) return setPublishResult("no shared client");
    try {
      client.publish("topic1", "message from /other", (err) => {
        setPublishResult(
          err ? `publish callback error: ${err.message}` : "publish callback ok",
        );
      });
      setPublishResult((p) => (p === "(not tried)" ? "publish() returned, waiting for callback…" : p));
    } catch (e: any) {
      setPublishResult(`publish threw: ${e?.message}`);
    }
  };

  return (
    <div>
      <h2>Other page</h2>
      <p id="client-state">{state}</p>
      <button id="publish-other" onClick={publish}>
        Publish from /other
      </button>
      <p id="publish-result">{publishResult}</p>
      <p>
        <Link id="to-home" href="/">
          Back home
        </Link>
      </p>
    </div>
  );
}
