import { randomBytes } from "crypto";
import { client } from "./client";

export const withLock = async (key: string, cb: () => any) => {

	const retryDelayMs = 100;
	let retries = 20; // We will decrement this for each failed retry 

	// Generate random value for lock key value 
	const randomValue = randomBytes(6).toString("hex");

	// Create the lock-key for the given key (`lock:${key}`)
	// We will use this to store the random value
	const lockKey = `lock:${key}`;


	// Setup the retry mechanism 
	// We will use this to retry the lock if it is already acquired
	while (retries >= 0) {
		retries--;
		// Try to acquire the lock
		const locked = await client.setNX(lockKey, randomValue);

		// If we failed to acquire the lock, we will retry after a delay
		if (!locked) {
			await pause(retryDelayMs);
			continue;
		}

		// If we successfully acquired the lock, we will execute the callback
		try {
			const result = await cb();
			return result;
		} finally {
			// Release the lock
			await client.del(lockKey);
		}
	}
};

const buildClientProxy = () => { };

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
