import { client } from '$services/redis';
import { userLikesKey, itemsKey } from '$services/keys';
import { getItems } from './items';

// To make the like button green if loggin user already liked the item
export const userLikesItem = async (itemId: string, userId: string) => {
	const isLiked = await client.sIsMember(userLikesKey(userId), itemId);
	return isLiked;
};

// Get all the items liked by an user with id (userId)
export const likedItems = async (userId: string) => {
	const ids = await client.sMembers(userLikesKey(userId));
	const items = await getItems(ids);
	return items;
};

// When user likes an item, we do two things, 1) Add the item to user liked items set. 2) Increase the counter of likes on the item's hash
export const likeItem = async (itemId: string, userId: string) => {
	const liked = await client.sAdd(userLikesKey(userId), itemId);
	// We only increment the like counter if user didn't already liked the post. (Note: using sAdd helped us a lookup as if we try to add duplicate like, it will return 0)
	if (liked) {
		await client.hIncrBy(itemsKey(itemId), 'likes', 1);
	}
};


// Opposite of like
export const unlikeItem = async (itemId: string, userId: string) => {
	const unlike = await client.sRem(userLikesKey(userId), itemId);
	if (unlike) {
		await client.hIncrBy(itemsKey(itemId), 'likes', -1);
	}
};


// Given two users, we will find the intersection of their liked items.
export const commonLikedItems = async (userOneId: string, userTwoId: string) => {
	const ids = await client.sInter([userLikesKey(userOneId), userLikesKey(userTwoId)]);
	return getItems(ids);
};
