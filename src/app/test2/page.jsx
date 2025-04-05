"use client";

import { useState } from "react";
import { getPayloadFromToken } from "@/lib/getTokenPayload";

export default function ShowPayloadPage() {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    try {
      const data = await getPayloadFromToken();
      if (data) {
        setPayload(data);
        console.log(data);
        setError(null);
      } else {
        setPayload(null);
        setError("No payload found or token invalid.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Token Payload Viewer</h1>
      <button onClick={handleClick}>Get Token Payload</button>

      {payload && (
        <pre style={{ marginTop: 20, background: "#f4f4f4", padding: 10 }}>
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}

      {error && <p style={{ color: "red", marginTop: 20 }}>{error}</p>}
    </div>
  );
}
