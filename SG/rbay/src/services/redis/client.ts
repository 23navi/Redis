import { createClient, defineScript } from 'redis';

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
		})
	}
});

client.on('error', (err) => console.error(err));
client.connect();

client.on("connect", async () => {
	const reply = await client.addOneAndStore("books:count", 5)
	const result = await client.get("books:count")
	console.log({ reply, result })
})

export { client };
