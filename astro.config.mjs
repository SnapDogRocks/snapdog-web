import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
  site: 'https://snapdog.cc',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mermaid({ autoTheme: true }),
    starlight({
      title: 'SnapDog',
      logo: {
        src: './src/assets/logo.svg',
      },
      components: {
        SiteTitle: './src/components/CustomSiteTitle.astro',
        Footer: './src/components/CustomFooter.astro',
      },
      social: {
        github: 'https://github.com/SnapDogRocks/snapdog',
      },
      sidebar: [
        { label: 'Introduction', link: '/docs/introduction' },
        { label: 'System Architecture', link: '/docs/architecture' },
        {
          label: 'Installation',
          items: [
            { label: 'Direct Installation', link: '/docs/install-direct' },
            { label: 'Docker Container', link: '/docs/install-docker' },
            { label: 'SnapDog OS', link: '/docs/snapdog-os' },
          ],
        },
        {
          label: 'User Manual',
          items: [
            { label: 'Configuration', link: '/docs/configuration' },
            { label: 'CLI Reference', link: '/docs/cli' },
          ],
        },
        {
          label: 'Developer Manual',
          items: [
            { label: 'REST API', link: '/docs/api-rest' },
            { label: 'WebSocket API', link: '/docs/api-websocket' },
            { label: 'D-Bus API (MPRIS2)', link: '/docs/api-dbus' },
            { label: 'Binary Protocol', link: '/docs/api-binary-protocol' },
          ],
        },
        { label: 'Licensing', link: '/docs/license' },
      ],
      customCss: [
        './src/styles/globals.css',
      ],
    }),
    mdx(),
  ],
});

