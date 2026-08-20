import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    other: {
      'fb:app_id': "FB_APP_ID",
    },
  }
}

/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  return null;
}
