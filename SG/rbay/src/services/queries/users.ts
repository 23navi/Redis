import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { usersKey, usernamesSetUniqueKey } from '$services/keys';
import { client } from '$services/redis';

export const getUserByUsername = async (username: string) => {};

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
	client.hSet(usersKey(userId), userSerializer(attrs));
	// Add username to set
	client.sAdd(usernamesSetUniqueKey(), attrs.username);

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
