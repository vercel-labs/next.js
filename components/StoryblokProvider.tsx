'use client';
import { initStoryblok } from '@/app/storyblok';

initStoryblok();

export default function StoryblokProvider({ children }: any) {
  return children;
}
