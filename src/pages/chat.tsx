"use client";

import "../app/globals.css";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

interface IMessage {
  id: string;
  body: string;
}

export default function Chat() {
  const topic = "/topic/chat";
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const clientRef = useRef<Client>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const ListMessages = () => {
    const listMessages = messages.map((message) => (
      <li
        className="max-w-fit m-3 border-s-stone-600 p-3 bg-gray-800 rounded-r-3xl rounded-bl-3xl text-3xl"
        key={message.id}
      >
        {message.body}
      </li>
    ));
    return <ul>{listMessages}</ul>;
  };

  return (
    <div className="flex flex-col h-screen w-full items-center gap-3 pb-6 overflow-hidden">
      <div className="flex-1 w-full overflow-y-auto px-4">
        <div className="flex flex-col justify-center-safe min-w-full">
          {ListMessages()}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <input
          className="bg-gray-700 border-s-violet-100 p-3 rounded-3xl size-12 w-3xs"
          type="text"
          value={message}
          onChange={(newMessage) => setMessage(newMessage.target.value)}
          onKeyDown={handleKeyDown}
        ></input>
        <button
          className="bg-gray-700 border-s-violet-100 p-3 rounded-3xl size-12 w-3xs"
          onClick={sendMessage}
        >
          Send message
        </button>
      </div>
    </div>
  );
}
