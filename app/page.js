export default async function Home() {
  const time = await fetch("http://localhost:3999/", { cache: "force-cache", next: { tags: ["current-time"] } }).then(r=>r.json()).then(d=>d.unixtime);
  return "home " + time;
}
