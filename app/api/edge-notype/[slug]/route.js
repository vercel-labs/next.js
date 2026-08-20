import { slowStream } from "../../../_stream"
export const runtime = "edge"
export const dynamic = "force-dynamic"
export async function GET() { return slowStream(null) }
