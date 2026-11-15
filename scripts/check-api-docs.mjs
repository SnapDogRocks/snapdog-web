import { readFile } from 'node:fs/promises';

const spec = JSON.parse(await readFile('src/assets/openapi.json', 'utf8'));
const guide = await readFile('src/content/docs/docs/api-rest.mdx', 'utf8');

if (spec.openapi !== '3.1.0' || spec.info?.title !== 'SnapDog REST API') {
  throw new Error('src/assets/openapi.json is not the expected SnapDog OpenAPI 3.1 contract');
}

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

// Every method of every path has to appear in api-rest.mdx too. The guide writes
// it as "**Method:** `GET` | `PUT`" above the endpoint, as "`POST` `/path`" or as
// "`GET /path`", so look for the path and then for the method name in the text
// from the heading before it up to the next heading.
const httpMethods = ['get', 'put', 'post', 'delete', 'patch'];
const sections = guide.split(/^#{2,4} /m);
function documentedMethods(path) {
  const found = new Set();
  for (const section of sections) {
    if (!section.includes(path)) continue;
    for (const match of section.matchAll(/\b(GET|PUT|POST|DELETE|PATCH)\b/g)) found.add(match[1].toLowerCase());
  }
  return found;
}
const missingMethods = [];
for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
  const documentedHere = documentedMethods(path);
  for (const method of httpMethods) {
    if (pathItem[method] && !documentedHere.has(method)) missingMethods.push(`${method.toUpperCase()} ${path}`);
  }
}
if (missingMethods.length > 0) {
  console.error('HTTP methods missing from api-rest.mdx:');
  for (const entry of missingMethods.sort()) console.error(`  ${entry}`);
  process.exit(1);
}

function resolveSchema(schema) {
  if (!schema?.$ref) return schema;
  const name = schema.$ref.split('/').at(-1);
  return spec.components?.schemas?.[name];
}

function matchesType(value, type) {
  if (type === 'null') return value === null;
  if (type === 'array') return Array.isArray(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  return typeof value === type;
}

function validate(value, unresolvedSchema, location) {
  const schema = resolveSchema(unresolvedSchema);
  if (!schema) return [`${location}: schema could not be resolved`];

  if (schema.oneOf || schema.anyOf) {
    const alternatives = schema.oneOf ?? schema.anyOf;
    if (alternatives.some((candidate) => validate(value, candidate, location).length === 0)) return [];
    return [`${location}: value does not match any allowed schema`];
  }

  const errors = [];
  const types = Array.isArray(schema.type) ? schema.type : [schema.type].filter(Boolean);
  if (types.length > 0 && !types.some((type) => matchesType(value, type))) {
    return [`${location}: expected ${types.join(' or ')}`];
  }
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${location}: value is not in the enum`);

  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const required of schema.required ?? []) {
      if (!(required in value)) errors.push(`${location}: missing required field ${required}`);
    }
    for (const [key, child] of Object.entries(value)) {
      if (schema.properties?.[key]) errors.push(...validate(child, schema.properties[key], `${location}.${key}`));
    }
  }
  if (Array.isArray(value) && schema.items) {
    value.forEach((entry, index) => errors.push(...validate(entry, schema.items, `${location}[${index}]`)));
  }
  return errors;
}

const exampleErrors = [];
let exampleCount = 0;
for (const match of guide.matchAll(/```json\s+schema=([A-Za-z0-9_]+)\s*\n([\s\S]*?)```/g)) {
  const [, schemaName, source] = match;
  exampleCount += 1;
  try {
    const value = JSON.parse(source);
    exampleErrors.push(...validate(value, { $ref: `#/components/schemas/${schemaName}` }, schemaName));
  } catch (error) {
    exampleErrors.push(`${schemaName}: invalid JSON example (${error.message})`);
  }
}

if (exampleErrors.length > 0) {
  console.error('REST examples do not match the generated OpenAPI schemas:');
  for (const error of exampleErrors) console.error(`  ${error}`);
  process.exit(1);
}

console.log(
  `API docs cover ${Object.keys(spec.paths).length} generated paths; ${exampleCount} schema-bound example(s) are valid.`,
);
