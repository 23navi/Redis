import type { CreateBidAttrs, Bid } from '$services/types';
import { client, withLock } from '$services/redis';
import { DateTime } from 'luxon';
import { bidHistoryKey, itemsByPriceKey, itemsKey } from '$services/keys';
import { getItem } from './items';

export const createBid = async (attrs: CreateBidAttrs) => {
	return withLock(attrs.itemId, async () => {
		const item = await getItem(attrs.itemId)

		if (!item) {
			throw new Error("Item not found")
		}

		// So here we are comparing the attrs' createdAt time, but there can be a delay when user created the bid and now, it's upto us which logic to use.
		if (attrs.createdAt > item.endingAt) {
			throw new Error("Bidding window is closed")
		}
		if (attrs.amount <= item.price) {
			throw new Error("Bid amount must be greater than the current price")
		}

		// atters.createdAt is an instance of luxon datetime, that's why we have .toMillis() on it
		const serializedBid = serializeHistory(attrs.amount, attrs.createdAt.toMillis())

		const result = await Promise.all([
			client.rPush(bidHistoryKey(attrs.itemId), serializedBid),
			client.hSet(itemsKey(attrs.itemId), {
				price: attrs.amount,
				highestBidUserId: attrs.userId,
				bids: item.bids + 1
			}),
			client.zAdd(itemsByPriceKey(), {
				value: attrs.itemId,
				score: attrs.amount
			}, { XX: true }) // Only update the score if item exist, don't create new member if member DNE
		]);

		console.log({ result })
		return result

	})

	// return client.executeIsolated(async (isolatedClient) => {
	// 	const item = await getItem(attrs.itemId)

	// 	if (!item) {
	// 		throw new Error("Item not found")
	// 	}

	// 	// So here we are comparing the attrs' createdAt time, but there can be a delay when user created the bid and now, it's upto us which logic to use.
	// 	if (attrs.createdAt > item.endingAt) {
	// 		throw new Error("Bidding window is closed")
	// 	}
	// 	if (attrs.amount <= item.price) {
	// 		throw new Error("Bid amount must be greater than the current price")
	// 	}


	// 	// atters.createdAt is an instance of luxon datetime, that's why we have .toMillis() on it
	// 	const serializedBid = serializeHistory(attrs.amount, attrs.createdAt.toMillis())

	// 	const result = await isolatedClient
	// 		.multi()
	// 		.rPush(bidHistoryKey(attrs.itemId), serializedBid)
	// 		.hSet(itemsKey(attrs.itemId), {
	// 			price: attrs.amount,
	// 			highestBidUserId: attrs.userId,
	// 			bids: item.bids + 1
	// 		})
	// 		.zAdd(itemsByPriceKey(), {
	// 			value: attrs.itemId,
	// 			score: attrs.amount
	// 		}, { XX: true }) // Only update the score if item exist, don't create new member if member DNE
	// 		.exec()

	// 	console.log({ result })
	// 	return result
	// })





	// // Bid creation validation checks
	// const item = await getItem(attrs.itemId)

	// if (!item) {
	// 	throw new Error("Item not found")
	// }

	// // So here we are comparing the attrs' createdAt time, but there can be a delay when user created the bid and now, it's upto us which logic to use.
	// if (attrs.createdAt > item.endingAt) {
	// 	throw new Error("Bidding window is closed")
	// }
	// if (attrs.amount <= item.price) {
	// 	throw new Error("Bid amount must be greater than the current price")
	// }


	// // atters.createdAt is an instance of luxon datetime, that's why we have .toMillis() on it
	// const serializedBid = serializeHistory(attrs.amount, attrs.createdAt.toMillis())

	// const result = await Promise.all([
	// 	// Adding the bid to the right of the list, new bids goes to the right
	// 	client.rPush(bidHistoryKey(attrs.itemId), serializedBid),
	// 	client.hSet(itemsKey(attrs.itemId), {
	// 		price: attrs.amount,
	// 		highestBidUserId: attrs.userId,
	// 		bids: item.bids + 1
	// 	})
	// ]);

	// console.log({ result })
	// return result

};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const startIndex = ((-1 * count) - offset);
	const endIndex = (-1 - offset)

	const bids = (await client.lRange(bidHistoryKey(itemId), startIndex, endIndex))
		.map((element) => deserializeHistory(element));
	return bids;
};


const serializeHistory = (amount: number, createdAt: number) => {
	return `${amount}:${createdAt}`
}
const deserializeHistory = (stored: string) => {
	const [amount, createdAt] = stored.split(':')
	return {
		amount: parseFloat(amount),
		createdAt: DateTime.fromMillis(Number(createdAt))
	}
}