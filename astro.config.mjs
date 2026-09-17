// @ts-check
import { defineConfig } from 'astro/config';

// One static route, no adapter needed: Vercel's Astro preset runs `astro build`
// and serves `dist/`. See vercel.json for cache headers on hashed assets.
export default defineConfig({
  // Set to the production URL once the Vercel domain is known.
  site: 'https://jason-landing.vercel.app',
  output: 'static',
  devToolbar: { enabled: false },
  build: {
    // Single page: inline the one stylesheet so first paint has no CSS request.
    inlineStylesheets: 'always',
  },
});
