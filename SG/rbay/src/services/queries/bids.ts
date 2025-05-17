import type { CreateBidAttrs, Bid } from '$services/types';
import { client } from '$services/redis';
import { DateTime } from 'luxon';
import { bidHistoryKey } from '$services/keys';

export const createBid = async (attrs: CreateBidAttrs) => {
	// atters.createdAt is an instance of luxon datetime, that's why we have .toMillis() on it
	const serializedBid = serializeHistory(attrs.amount, attrs.createdAt.toMillis())

	// Adding the bid to the right of the list, new bids goes to the right
	return client.rPush(bidHistoryKey(attrs.itemId), serializedBid)
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