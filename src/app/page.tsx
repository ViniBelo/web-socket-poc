"use client";

import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const topic = "/topic/chat";
  const [message, setMessage] = useState("");

  const clientRef = useRef<Client>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        client.subscribe(topic, (message) =>
          console.log(`Received: ${message.body}`),
        );
        client.publish({ destination: topic, body: "Hello, World!" });
      },
      onDisconnect: () => {
        console.log("Disconnected");
      },
    });
    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({ destination: topic, body: message });
      setMessage("");
    } else {
      console.log("Not connected to the WebSocket server");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-w-screen min-h-screen gap-3">
      <input
        className="bg-gray-700 border-s-violet-100 p-3 rounded-3xl size-12 w-3xs"
        type="text"
        value={message}
        onChange={(newMessage) => setMessage(newMessage.target.value)}
      ></input>
      <button
        className="bg-gray-700 border-s-violet-100 p-3 rounded-3xl size-12 w-3xs"
        onClick={sendMessage}
      >
        Send message
      </button>
    </div>
  );
}
