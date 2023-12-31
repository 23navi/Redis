import { itemsKey, itemsByViewsKey } from '$services/keys';
import { client } from '$services/redis';
export const incrementView = async (itemId: string, userId: string) => {
	await Promise.all([
		client.hIncrBy(itemsKey(itemId), 'views', 1),
		client.zIncrBy(itemsByViewsKey(), 1, itemId)
	]);
};
