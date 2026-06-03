import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://snapdog.cc',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    starlight({
      title: 'SnapDog',
      logo: {
        src: './src/assets/logo.svg',
      },
      social: {
        github: 'https://github.com/SnapDogRocks/snapdog',
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/docs/introduction' },
            { label: 'Installation', link: '/docs/installation' },
          ],
        },
        {
          label: 'SnapDog OS',
          items: [
            { label: 'Overview & Setup', link: '/docs/snapdog-os' },
          ],
        },
        {
          label: 'Developer Reference',
          items: [
            { label: 'API Reference', link: '/docs/api' },
          ],
        },
      ],
      customCss: [
        './src/styles/globals.css',
      ],
    }),
    mdx(),
  ],
});

