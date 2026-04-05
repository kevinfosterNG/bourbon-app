import { readFile } from 'node:fs/promises';

const raw = await readFile(new URL('./seed-bottles.json', import.meta.url), 'utf8');
const bottles = JSON.parse(raw);

if (!Array.isArray(bottles) || bottles.length < 50) {
  throw new Error('seed-bottles.json must contain at least 50 bottle records.');
}

for (const bottle of bottles) {
  const required = ['id', 'name', 'distillery', 'proof', 'category', 'flavorTags'];
  for (const key of required) {
    if (!(key in bottle)) {
      throw new Error(`Bottle ${bottle.id ?? 'unknown'} missing key: ${key}`);
    }
  }
}

console.log(`Validated ${bottles.length} bottles.`);
