"use client";

import "../app/globals.css";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

interface IMessage {
  id: string;
  body: string;
  user: IUser;
}

interface IUser {
  id: string;
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const clientRef = useRef<Client>(null);
  const [user] = useState<IUser>({ id: crypto.randomUUID() });

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
        client.subscribe(
          "/topic/chat/0f35fca9-e4de-4b49-8239-bc0cdea82c74",
          (message) => {
            const payload = JSON.parse(message.body);
            setMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                body: payload.content,
                user: { id: payload.senderId },
              },
            ]);
          },
        );
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
      const payload = { content: message, senderId: user.id };
      clientRef.current.publish({
        destination: "/app/chat/0f35fca9-e4de-4b49-8239-bc0cdea82c74",
        body: JSON.stringify(payload),
      });
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
    const listMessages = messages.map((message) => {
      const isAuthor = message.user.id === user.id;

      return (
        <li
          key={message.id}
          className={`max-w-fit m-3 p-3 text-3xl break-all ${
            isAuthor
              ? "self-end bg-violet-900 rounded-l-3xl rounded-br-3xl"
              : "self-start bg-gray-800 rounded-r-3xl rounded-bl-3xl"
          }`}
        >
          {message.body}
        </li>
      );
    });
    return <ul className="flex flex-col w-full">{listMessages}</ul>;
  };

  return (
    <div className="flex flex-col h-screen w-full items-center gap-3 pb-6 overflow-hidden">
      <div className="flex-1 w-full overflow-y-auto px-4">
        <div className="flex flex-col min-w-full">
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
