import { revalidateTag } from "next/cache";
import { read, write } from "../../../db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id")!;
  const op = url.searchParams.get("op")!;
  const db = read();
  if (op === "del") {
    delete db[id];
  } else {
    db[id] = { id, name: "Bulbasaur" };
  }
  write(db);
  revalidateTag(`pokemon-${id}`);
  return Response.json({ op, id, db });
}
