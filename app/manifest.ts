import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return { name: "r", short_name: "r", start_url: "/", display: "standalone" }; }
