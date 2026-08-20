// Reporter's original shape: awaited fetch, then ImageResponse with
// <div>{variable} text</div> children (no display: flex on the inner divs).
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const GET = async (request: Request) => {
  const res = await fetch(new URL("/api/data", request.url));
  const data = await res.json();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          fontSize: 32,
        }}
      >
        <div>{data.totalGuilds} guilds</div>
        <div style={{ marginTop: 10 }}>{data.totalChannels} channels</div>
      </div>
    ),
    { width: 1200, height: 600 },
  );
};
