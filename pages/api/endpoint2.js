import _ from 'lodash'
import { format } from 'date-fns'
export default function handler(req, res) {
  res.json({ n: 2, at: format(new Date(), 'yyyy-MM-dd'), keys: _.keys(req.query) })
}
