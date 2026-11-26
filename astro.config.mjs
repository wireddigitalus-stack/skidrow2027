import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.skidrow.com',
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: false },
  }),
  compressHTML: true,
  redirects: {
    '/shows': '/tour',
    '/venue': '/bio',
    '/blog': '/news',
    '/copy-of-tour': '/mailing-list',
    '/copy-of-music-1': '/music/skid-row-1989',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
