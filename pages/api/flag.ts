import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
const FLAG = "/tmp/notfound-flag";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.query.on === "1") fs.writeFileSync(FLAG, "1");
  else if (fs.existsSync(FLAG)) fs.unlinkSync(FLAG);
  res.json({ notFound: fs.existsSync(FLAG) });
}
