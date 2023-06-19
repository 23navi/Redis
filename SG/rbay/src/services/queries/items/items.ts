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

export const getItems = async (ids: string[]) => {};

export const createItem = async (attrs: CreateItemAttrs, userId: string) => {
	const itemId = genId();
	await client.hSet(itemsKey(itemId), serialize(attrs));
	return itemId;
};
