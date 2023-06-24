import { client } from '$services/redis';
import { userLikesKey, itemsKey } from '$services/keys';
import { getItems } from './items';

// To make the like button green if loggin user already liked the item
export const userLikesItem = async (itemId: string, userId: string) => {
	const isLiked = await client.sIsMember(userLikesKey(userId), itemId);
	return isLiked;
};

export const likedItems = async (userId: string) => {
	const ids = await client.sMembers(userLikesKey(userId));
	const items = await getItems(ids);
	return items;
};

export const likeItem = async (itemId: string, userId: string) => {
	const liked = await client.sAdd(userLikesKey(userId), itemId);
	if (liked) {
		await client.hIncrBy(itemsKey(itemId), 'likes', 1);
	}
};

export const unlikeItem = async (itemId: string, userId: string) => {
	const unlike = await client.sRem(userLikesKey(userId), itemId);
	if (unlike) {
		await client.hIncrBy(itemsKey(itemId), 'likes', -1);
	}
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
	const ids = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)]);
	return getItems(ids);
};
