"use client";

import "../app/globals.css";
import { useEffect, useState } from "react";

interface IChat {
  id: string;
  name: string;
}

export default function Chats() {
  const [chats, setChats] = useState<Array<IChat>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/chats");
        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }
        const data = await response.json();
        setChats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-2xl text-gray-400">Loading chats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-2xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Chats</h1>
      {chats.length === 0 ? (
        <p className="text-xl text-gray-400">No chats available</p>
      ) : (
        <ul className="flex flex-col w-full max-w-2xl gap-3">
          {chats.map((chat) => (
            <li key={chat.id}>
              <a
                href={`/chat/${chat.id}`}
                className="block p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <p className="text-xl">{chat.name || `Chat ${chat.id}`}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
