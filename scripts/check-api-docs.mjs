import { readFile } from 'node:fs/promises';

const spec = JSON.parse(await readFile('src/assets/openapi.json', 'utf8'));
const guide = await readFile('src/content/docs/docs/api-rest.mdx', 'utf8');

const documented = new Set(
  [...guide.matchAll(/`[^`]*?(\/api\/v1\/[^`\s?#]+)/g)].map((match) => match[1]),
);
const missing = Object.keys(spec.paths ?? {})
  .filter((path) => !documented.has(path))
  .sort();

if (missing.length > 0) {
  console.error('REST endpoints missing from api-rest.mdx:');
  for (const path of missing) console.error(`  ${path}`);
  process.exit(1);
}

console.log(`API docs cover all ${documented.size} documented references and ${Object.keys(spec.paths).length} generated paths.`);
