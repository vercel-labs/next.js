import {db} from "./redirect";

export default function handler(req, res) {
  db.redirect = true;
  res.end('Redirect enabled')
}
