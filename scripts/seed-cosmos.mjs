import { CosmosClient } from '@azure/cosmos';
import { readFile } from 'node:fs/promises';

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE ?? 'bourbon-finder';
const containerId = process.env.COSMOS_CONTAINER ?? 'bottles';

if (!endpoint || !key) {
  throw new Error('COSMOS_ENDPOINT and COSMOS_KEY are required.');
}

const client = new CosmosClient({ endpoint, key });
const { database } = await client.databases.createIfNotExists({ id: databaseId });
const { container } = await database.containers.createIfNotExists({ id: containerId, partitionKey: { paths: ['/id'] } });

const raw = await readFile(new URL('./seed-bottles.json', import.meta.url), 'utf8');
const bottles = JSON.parse(raw);

for (const bottle of bottles) {
  await container.items.upsert(bottle);
}

console.log(`Seeded ${bottles.length} bottles to ${databaseId}/${containerId}`);
