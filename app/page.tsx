import Image from "next/image";
import sampleImage from "./sample.jpg";

/** Add your relevant code here for the issue to reproduce */
export default function Home() {
	return (
		<>
			you'll only see the long paint in a built app. different ways to see a
			long paint:
			<ul>
				<li>open devtools and hard refresh (CMD/CTRL + SHIFT + R)</li>
				<li>resize your browser window</li>
			</ul>
			I see paints somewhere on the order of 1200ms (M1 Max Macbook)
			<div style={{ height: "100vh" }} />
			<Image
				loading="lazy"
				src={sampleImage}
				alt="sample"
				style={{ width: "100%", height: "100%" }}
				placeholder="blur"
			/>
		</>
	);
}
