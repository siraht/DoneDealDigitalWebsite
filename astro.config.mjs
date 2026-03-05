import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'http://localhost:4321',
  output: 'static',
  integrations: [tailwind()]
});
