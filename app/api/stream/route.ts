import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "nodejs",
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  console.log(
    `--- [SERVER] Request handler invoked at ${new Date().toISOString()} ---`
  );

  const bodyStream = request.body;
  if (!bodyStream) {
    return new Response("No request body", { status: 400 });
  }

  const reader = bodyStream.getReader();
  const decoder = new TextDecoder();
  let chunkCount = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log(
          `--- [SERVER] Stream finished at ${new Date().toISOString()} ---`
        );
        break;
      }

      chunkCount++;
      const chunk = decoder.decode(value, { stream: true });
      // This log will only fire once, with the full content.
      console.log(
        `[SERVER] Chunk #${chunkCount} received at ${new Date().toISOString()}: "${chunk.trim()}"`
      );
    }
  } catch (error) {
    console.error("Stream processing failed:", error);
    return NextResponse.json(
      { error: "Stream processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, chunksReceived: chunkCount });
}
