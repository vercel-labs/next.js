import { StoryTray } from "./story-tray";

export default function Home() {
  return (
    <StoryTray
      stories={[
        { id: "0", label: "Ankit's Story" },
        { id: "1", label: "Taylor's Story" },
      ]}
    />
  );
}
