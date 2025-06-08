import { client } from "$services/redis";
import { itemsIndexKey } from "$services/keys";
import { deserialize } from "./deserialize";

interface QueryOpts {
	// page and perPage is like limit and offset (for pagination)
	page: number;
	perPage: number;

	// sortBy and direction is for actual sorting in 'none',"asc","desc" way.
	sortBy: string;
	direction: string;
}

// This endpoint is used by dashboard page to show the items that are placed for bid by the currently logged in user.
export const itemsByUser = async (userId: string, opts: QueryOpts) => {

	// We only want to list items which are created by current user. And we are using orderId to query it and in index, we have marked orderId as TAG
	const query = `@ownerId:{${userId}}`

	const sortCriteria = opts.sortBy && opts.direction && {
		BY: opts.sortBy,
		DIRECTION: opts.direction
	}

	const { total, documents } = await client.ft.search("idx:items", query, {
		ON: "HASH",
		SORTBY: sortCriteria,
		LIMIT: {
			offset: opts.perPage * opts.page,
			size: opts.perPage
		}
	} as any) // Agian some issue with node:redis and typescript 


	return {
		totalPages: 0,
		items: []
	}
};



// We will be producing the table with (item name, price, time left, no. of bids, no. of views, no. of likes and hyperlink to the bid)

// Note: Redisearch can do sorting for us on hash field but only one field at a time and we have to tell which fileds are sortable when creating the index for that hash items
