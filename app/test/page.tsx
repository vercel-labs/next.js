import {
  StoryblokClient,
  StoryblokStory,
  ISbStoriesParams,
  getStoryblokApi,
} from '@storyblok/react/rsc';

export default async function Test() {
  const { data } = await fetchData();

  return (
    <div>
      <h1>Story: {data.story.id}</h1>
      <StoryblokStory story={data.story} />
    </div>
  );
}

async function fetchData() {
  let sbParams: ISbStoriesParams = { version: 'draft' };
  const storyblokApi: StoryblokClient = getStoryblokApi();
  return storyblokApi.get(`cdn/stories/home`, sbParams);
}
