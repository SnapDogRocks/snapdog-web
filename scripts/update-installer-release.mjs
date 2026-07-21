import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const tag = process.argv[2];
const tagPattern = /^v\d+\.\d+\.\d+$/;
if (!tagPattern.test(tag ?? '')) {
  throw new Error(`Expected a tag like v0.2.1, received: ${tag ?? '(missing)'}`);
}

const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const response = await fetch(`https://api.github.com/repos/SnapDogRocks/snapdog-os-installer/releases/tags/${encodeURIComponent(tag)}`, { headers });
if (!response.ok) throw new Error(`GitHub release lookup failed (${response.status}): ${await response.text()}`);

const release = await response.json();
if (release.draft) throw new Error(`Refusing to publish links for draft release ${tag}`);
if (release.prerelease) throw new Error(`Refusing to publish links for prerelease ${tag}`);
if (release.tag_name !== tag) throw new Error(`GitHub returned unexpected tag ${release.tag_name}`);

const names = release.assets.map(({ name }) => name);
const escapedVersion = tag.slice(1).replaceAll('.', '\\.');
const requiredAssets = {
  macosUniversalDmg: new RegExp(`^snapdog-os-installer-${escapedVersion}-macos-universal\\.dmg$`),
  windowsX64Exe: new RegExp(`^snapdog-os-installer-${escapedVersion}-windows-x86_64\\.exe$`),
  windowsArm64Exe: new RegExp(`^snapdog-os-installer-${escapedVersion}-windows-aarch64\\.exe$`),
  linuxX64AppImage: new RegExp(`^snapdog-os-installer-${escapedVersion}-linux-x86_64\\.AppImage$`),
  linuxArm64AppImage: new RegExp(`^snapdog-os-installer-${escapedVersion}-linux-aarch64\\.AppImage$`),
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

const output = fileURLToPath(new URL('../src/data/snapdog-os-installer-release.json', import.meta.url));
await writeFile(output, `${JSON.stringify(metadata, null, 2)}\n`);
console.log(`SnapDog OS Installer release metadata now points to ${tag}`);
