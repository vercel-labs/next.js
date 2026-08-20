export const db = {
  redirect: false
};

export default function handler(req, res) {
  res.json(db);
  res.status(204).end();
}
