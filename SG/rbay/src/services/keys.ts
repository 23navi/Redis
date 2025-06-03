// String
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

//sortedset
export const itemsByViewsKey = () => {
	return 'items:views';
};

//sortedset
export const itemsByEndingAtKey = () => {
	return 'items:endingat';
};


//HLL
export const itemsViewsKey = (itemId: string) => {
	return `items:views#${itemId}`;
};


//List
export const bidHistoryKey = (itemId: string) => {
	return `history#${itemId}`
}


// Sorted set
export const itemsByPriceKey = () => {
	return 'items:price';
}



// Indexes

// idx:items
export const itemsIndexKey = () => {
	return 'idx:items';
}