"use client";

import "../app/globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateChat() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Chat name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      router.push("/chats");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Create New Chat</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter chat name"
          className="bg-gray-700 p-3 rounded-xl text-lg"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="action-button disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Chat"}
        </button>
      </form>
      <a href="/" className="text-gray-400 hover:text-white">
        Back to home
      </a>
    </div>
  );
}
