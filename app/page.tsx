import type {Metadata} from "next";

/** Add your relevant code here for the issue to reproduce */
export async function generateMetadata(): Promise<Metadata> {
  const ukWebsite = new URL('/', 'https://example.com');
  const usWebsite = new URL('/us', 'https://example.com');

  console.log({
    ukWebsite: ukWebsite,
    ukWebsiteToString: ukWebsite.toString(),
    usWebsite: usWebsite,
    usWebsiteToString: usWebsite.toString()
  });

  return {
    alternates: { languages: {'en-GB': ukWebsite, 'en-US': usWebsite } }
  };
}

export default function Home() {
  return null;
}
