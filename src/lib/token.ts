import { auth } from "@clerk/nextjs/server";

export default async function getServerToken() {
  const { getToken } = auth();
  return getToken();
}