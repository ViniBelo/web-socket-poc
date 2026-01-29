import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">Welcome to Chat</h1>
      <p className="text-xl text-gray-400">Start a conversation or browse existing chats</p>
      <div className="flex gap-4">
        <Link href="/chats">
          <button className="action-button">List chats</button>
        </Link>
        <Link href="/create-chat">
          <button className="action-button">Create chat</button>
        </Link>
      </div>
    </div>
  );
}
