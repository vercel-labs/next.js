import { Metadata } from "next";
import { connection } from "next/server";

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  return { title: "My App", description: "My App Description" };
}

export default function Home() {
  return <h1>Hello</h1>;
}
