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
            { label: 'Configuration', link: '/docs/configuration' },
            { label: 'CLI Reference', link: '/docs/cli' },
            { label: 'Licensing', link: '/docs/license' },
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
            { label: 'REST API', link: '/docs/api-rest' },
            { label: 'WebSocket API', link: '/docs/api-websocket' },
            { label: 'D-Bus API (MPRIS2)', link: '/docs/api-dbus' },
            { label: 'Binary Protocol', link: '/docs/api-binary-protocol' },
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

