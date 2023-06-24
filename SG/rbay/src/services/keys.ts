export const pageCacheKey = (id: string) => {
	return `pagecache#${id}`;
};

export const usersKey = (id: string) => {
	return `users#${id}`;
};

export const sessionsKey = (sessionId: string) => {
	return `sessions#${sessionId}`;
};

export const itemsKey = (itemId: string) => {
	return `items#${itemId}`;
};

export const usernamesSetUniqueKey = () => {
	// This is the name of the set
	return `usernames:unique`;
};
