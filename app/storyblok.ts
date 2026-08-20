import Page from '@/components/Page';
import Teaser from '@/components/Teaser';
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';

const initStoryblok = () => {
  storyblokInit({
    accessToken: 'NFyJ0ZtX3mudQehnkmxtgQtt',
    use: [apiPlugin],
    apiOptions: {
      // point storyblok-js-client at the local mock route
      endpoint: 'http://localhost:3000/api/sb/',
    },
    components: {
      teaser: Teaser,
      page: Page,
    },
  });
};

export { initStoryblok };
