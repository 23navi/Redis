//hash
export const pageCacheKey = (id: string) => {
	return `pagecache#${id}`;
};

//hash
export const usersKey = (id: string) => {
	return `users#${id}`;
};

//hash
export const sessionsKey = (sessionId: string) => {
	return `sessions#${sessionId}`;
};

// hash
export const itemsKey = (itemId: string) => {
	return `items#${itemId}`;
};

//sorted set
export const usernamesKey = () => {
	return `usernames`;
};

//set
export const usernamesSetUniqueKey = () => {
	// This is the name of the set
	return `usernames:unique`;
};

//hash
export const userLikesKey = (userId) => {
	return `userlikes#${userId}`;
};
