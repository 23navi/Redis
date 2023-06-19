import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { serialize } from './serialize';
import { deserialize } from './deserialize';
import { itemsKey } from '$services/keys';
import { genId } from '$services/utils';

export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id));

	if (Object.keys(item).length === 0) {
		return null;
	}

	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
	const getCommands = ids.map((id) => {
		return client.hGetAll(itemsKey(id));
	});

	const pipelineResults = await Promise.all(getCommands);

	return pipelineResults.map((result, i) => {
		if (Object.keys(result).length === 0) {
			return null;
		}
		return deserialize(ids[i], result);
	});
};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
	const itemId = genId();
	await client.hSet(itemsKey(itemId), serialize(attrs));
	return itemId;
};
