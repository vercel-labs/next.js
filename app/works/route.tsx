// Control: single text child per <div> -> renders fine.
import { ImageResponse } from "next/og";

export const runtime = "edge";

export const GET = async () => {
  const totalGuilds = 123;
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
        <div>{`${totalGuilds} guilds`}</div>
      </div>
    ),
    { width: 1200, height: 600 },
  );
};
