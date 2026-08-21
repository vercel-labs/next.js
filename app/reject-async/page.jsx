async function getCurrentSession() {
  await new Promise((r) => setTimeout(r, 10));
  throw new Error("boom from db driver");
}

export default async function Page() {
  const { user } = await getCurrentSession();
  return <p>{user.id}</p>;
}
