import { largeStream } from "../../../_stream"

export const dynamic = "force-dynamic"
export async function GET() { return largeStream() }
