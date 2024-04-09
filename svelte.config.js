import { vitePreprocess } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';

const config = {
  preprocess: vitePreprocess(),
  preprocess: preprocess({
    postcss: true,
  }),
};

export default config;
