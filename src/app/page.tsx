"use client";

import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

interface IMessage {
  id: string;
  body: string;
}

export default function Home() {
  const topic = "/topic/chat";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<IMessage>>([]);

  const clientRef = useRef<Client>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      onConnect: () => {
        client.subscribe(topic, (message) => {
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), body: message.body },
          ]);
        });
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

  const ListMessages = () => {
    const listMessages = messages.map((message) => (
      <li
        className="max-w-fit m-3 border-s-stone-600 p-3 bg-gray-800 rounded-r-3xl rounded-tl-3xl text-3xl"
        key={message.id}
      >
        {message.body}
      </li>
    ));
    return <ul>{listMessages}</ul>;
  };

  return (
    <div className="flex flex-col justify-end-safe pb-6 items-center min-w-screen min-h-screen gap-3">
      <div className="flex flex-col justify-center-safe min-w-full">
        {ListMessages()}
      </div>
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
