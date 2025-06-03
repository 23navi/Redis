import { itemsByViewsKey, itemsKey, itemsViewsKey } from '$services/keys';
import { createClient, defineScript } from 'redis';
import { createIndexes } from './create-indexes';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
	scripts: {
		addOneAndStore: defineScript({
			NUMBER_OF_KEYS: 1,
			SCRIPT:
				`
				local key = KEYS[1]
				local count = tonumber(ARGV[1])
				for i = 1, count do
					redis.call('INCR', key)
				end
				return redis.call('GET', key)
			`,
			transformArguments(key: string, incrementCount: number) {
				return [key, incrementCount.toString()];
			},
			transformReply(reply: string) {
				return parseInt(reply, 10);
			}
		}),
		incrementView: defineScript({
			NUMBER_OF_KEYS: 3,
			SCRIPT: `
				local itemsViewsKey = KEYS[1]
				local itemsKey = KEYS[2]
				local itemsByViewsKey = KEYS[3]
				local itemId = ARGV[1]
				local userId = ARGV[2]

				local inserted = redis.call('PFADD', itemsViewsKey, userId)

				if inserted == 1 then
					redis.call('HINCRBY', itemsKey, 'views', 1)
					redis.call('ZINCRBY', itemsByViewsKey, 1, itemId)
				end
			`,
			transformArguments(itemId: string, userId: string) {
				return [itemsViewsKey(itemId), itemsKey(itemId), itemsByViewsKey(), itemId, userId];
			},
			transformReply() { }
		}),
		unlock: defineScript({
			NUMBER_OF_KEYS: 1,
			SCRIPT: `
				local lockKey = KEYS[1]
				local value = ARGV[1]
				local lockKeyValue = redis.call('GET', lockKey)
				if lockKeyValue == value then
					return redis.call('DEL', lockKey)
				end
				`
			,
			transformArguments(lockKey: string, value: string) {
				return [lockKey, value];
			},
			transformReply(reply: string) {
				return reply === '1';
			}
		})

	}
});

client.on('error', (err) => console.error(err));
client.connect();


// run the create indexs on client connection.
client.on("connect", async () => {
	await createIndexes()
})

// client.on("connect", async () => {
// 	const reply = await client.addOneAndStore("books:count", 5)
// 	const result = await client.get("books:count")
// 	console.log({ reply, result })
// })

export { client };
