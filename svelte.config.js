// import adapter from '@sveltejs/adapter-node';
import adapter from 'amplify-adapter';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    
    // Solo agregamos el alias para $stores
    alias: {
      $stores: path.resolve('src/stores')
    }
  }
};

export default config;
