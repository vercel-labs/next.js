import {
  StoryblokClient,
  StoryblokStory,
  ISbStoriesParams,
  getStoryblokApi,
} from '@storyblok/react/rsc';
import Link from 'next/link';

export default async function Home() {
  const { data } = await fetchData();

  return (
    <div>
      <h1>Story: {data.story.id}</h1>
      <StoryblokStory story={data.story} />
      <Link href={'/test'}>Go to test (next link)</Link>
      <a href={'/test'}>Go to test (standard a tag)</a>
      <Link href={'/singleton'}>Go to singleton (next link)</Link>
    </div>
  );
}

async function fetchData() {
  let sbParams: ISbStoriesParams = { version: 'draft' };

  const storyblokApi: StoryblokClient = getStoryblokApi();
  return storyblokApi.get(`cdn/stories/home`, sbParams);
}
