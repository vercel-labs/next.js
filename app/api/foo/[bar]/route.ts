import { db } from '../../../../db/connect';
import { dbGlobal } from '../../../../db/connect-global';

export async function GET() {
  return Response.json({ plain: db.id, global: dbGlobal.id });
}
