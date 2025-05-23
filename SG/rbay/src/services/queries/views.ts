import { itemsKey, itemsByViewsKey, itemsViewsKey } from '$services/keys';
import { client } from '$services/redis';
export const incrementView = async (itemId: string, userId: string) => {

	// Using LUA script
	return client.incrementView(itemId, userId);


	// // If increament is 0, the user already viewed this item, if 1 then this is an new view
	// const increment = await client.pfAdd(itemsViewsKey(itemId), userId)

	// if (increment) {
	// 	await Promise.all([
	// 		client.hIncrBy(itemsKey(itemId), 'views', 1),
	// 		client.zIncrBy(itemsByViewsKey(), 1, itemId)
	// 	]);
	// }

};
