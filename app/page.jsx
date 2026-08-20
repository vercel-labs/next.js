import { MDXRemote } from "next-mdx-remote/rsc";
export default function Home() {
  return (<main><MDXRemote source={"# Some Markdown here\n\nMore content here too!\n"} /></main>);
}
