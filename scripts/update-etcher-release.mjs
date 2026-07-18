import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const tag = process.argv[2];
const tagPattern = /^v\d+\.\d+\.\d+-snapdog\.[1-9]\d*$/;
if (!tagPattern.test(tag ?? '')) {
  throw new Error(`Expected a tag like v2.1.6-snapdog.1, received: ${tag ?? '(missing)'}`);
}

const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const response = await fetch(`https://api.github.com/repos/SnapDogRocks/snapdog-etcher/releases/tags/${encodeURIComponent(tag)}`, { headers });
if (!response.ok) throw new Error(`GitHub release lookup failed (${response.status}): ${await response.text()}`);

const release = await response.json();
if (release.draft) throw new Error(`Refusing to publish links for draft release ${tag}`);
if (release.tag_name !== tag) throw new Error(`GitHub returned unexpected tag ${release.tag_name}`);

const names = release.assets.map(({ name }) => name);
const requiredAssets = {
  macosUniversalDmg: /^macos-universal-.*-universal\.dmg$/i,
  windowsX64Exe: /^windows-x64-.*\.Setup\.exe$/i,
  linuxX64Deb: /^linux-x64-.*_amd64\.deb$/i,
  linuxX64Rpm: /^linux-x64-.*\.x86_64\.rpm$/i,
  linuxX64Zip: /^linux-x64-.*linux-x64.*\.zip$/i,
  linuxArm64Deb: /^linux-arm64-.*_arm64\.deb$/i,
  linuxArm64Rpm: /^linux-arm64-.*\.arm64\.rpm$/i,
  linuxArm64Zip: /^linux-arm64-.*linux-arm64.*\.zip$/i,
};

const assets = Object.fromEntries(Object.entries(requiredAssets).map(([key, pattern]) => {
  const matches = names.filter((name) => pattern.test(name));
  if (matches.length !== 1) {
    throw new Error(`${key}: expected exactly one asset matching ${pattern}, found ${matches.length}: ${matches.join(', ') || '(none)'}`);
  }
  return [key, matches[0]];
}));

const metadata = {
  tag: release.tag_name,
  version: release.tag_name.slice(1),
  releaseUrl: release.html_url,
  publishedAt: release.published_at,
  assets,
};

const output = fileURLToPath(new URL('../src/data/snapdog-etcher-release.json', import.meta.url));
await writeFile(output, `${JSON.stringify(metadata, null, 2)}\n`);
console.log(`SnapDog Etcher release metadata now points to ${tag}`);
