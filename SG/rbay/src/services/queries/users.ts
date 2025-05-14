import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { usersKey, usernamesSetUniqueKey, usernamesKey } from '$services/keys';
import { client } from '$services/redis';

export const getUserByUsername = async (username: string) => {
	const decimalUserId = await client.zScore(usernamesKey(), username);
	if (decimalUserId === null) {
		throw new Error('User not found');
	}
	const userId = decimalUserId.toString(16);
	const user = await client.hGetAll(usersKey(userId));

	return userDeserializer(userId, user);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	if (Object.keys(user).length === 0) {
		return null;
	}
	return userDeserializer(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const alreadyExists = await client.sIsMember(usernamesSetUniqueKey(), attrs.username);
	// 1 if user with given username already exist in set
	if (alreadyExists) {
		throw new Error('Username is taken');
	}

	const userId = genId();

	// This is simply saving the user in db, if we are using a mix of redis and postgres, this can be an user table.
	await client.hSet(usersKey(userId), userSerializer(attrs));

	// Add username to set (This is to check if user name already exist on new signup)
	await client.sAdd(usernamesSetUniqueKey(), attrs.username);

	await client.zAdd(usernamesKey(), {
		value: attrs.username,
		score: parseInt(userId, 16)
	});
	return userId;
};

const userSerializer = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const userDeserializer = (id: string, user: { [keys: string]: string }) => {
	return {
		id: id, // UserId
		username: user.username,
		password: user.password
	};
};
