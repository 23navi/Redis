export const pageCacheKey = (id: string) => {
	return `pagecache#${id}`;
};

export const usersKey = (id: string) => {
	return `users#${id}`;
};

export const sessionsKey = (sessionId: string) => {
	return `sessions#${sessionId}`;
};
