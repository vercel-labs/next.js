import { initStoryblok } from './storyblok';
import { initSingleton } from '@/lib/singleton';
import StoryblokProvider from '@/components/StoryblokProvider';

// module-scope side effects in the root layout
initStoryblok();
initSingleton();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoryblokProvider>{children}</StoryblokProvider>
      </body>
    </html>
  );
}
