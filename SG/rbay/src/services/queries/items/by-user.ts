interface QueryOpts {
	page: number;
	perPage: number;
	sortBy: string;
	direction: string;
}

// This endpoint is used by dashboard page to show the items that are placed for bid by the currently logged in user.
export const itemsByUser = async (userId: string, opts: QueryOpts) => {
	return []
};



// We will be producing the table with (item name, price, time left, no. of bids, no. of views, no. of likes and hyperlink to the bid)

// Note: Redisearch can do sorting for us on hash field but only one field at a time and we have to tell which fileds are sortable when creating the index for that hash items
