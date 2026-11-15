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
      favicon: '/favicon.svg',
      head: [
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#0a0a0a' } },
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://snapdog.cc/snapdog-hero.jpg' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
      ],
      logo: {
        src: './src/assets/logo.svg',
      },
      components: {
        SiteTitle: './src/components/CustomSiteTitle.astro',
        Footer: './src/components/CustomFooter.astro',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/SnapDogRocks/snapdog' },
      ],
      sidebar: [
        { label: 'Introduction', link: '/docs/introduction' },
        { label: 'System Architecture', link: '/docs/architecture' },
        {
          label: 'Installation',
          items: [
            { label: 'Direct Installation', link: '/docs/install-direct' },
            { label: 'Docker Container', link: '/docs/install-docker' },
            { label: 'SnapDog OS', link: '/docs/snapdog-os' },
            { label: 'SnapDog Update CLI', link: '/docs/snapdog-update' },
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
          label: 'Integrations',
          items: [
            { label: 'Home Assistant', link: '/docs/home-assistant' },
          ],
        },
        {
          label: 'Developer Manual',
          items: [
            { label: 'REST API Guide', link: '/docs/api-rest' },
            { label: 'Generated REST Reference', link: '/docs/api-reference' },
            { label: 'WebSocket API', link: '/docs/api-websocket' },
            { label: 'D-Bus API (MPRIS2)', link: '/docs/api-dbus' },
            { label: 'Binary Protocol', link: '/docs/api-binary-protocol' },
            { label: 'SnapDog OS Control API', link: '/docs/api-snapdog-ctrl' },
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
