import Link from "next/link";

export default function Page() {
  return (
    <ul>
      <li>
        <Link href={"/chat"}>Chat</Link>
      </li>
    </ul>
  );
}
