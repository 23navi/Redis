import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { usersKey } from '$services/keys';
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
	const userId = genId();
	client.hSet(usersKey(userId), userSerializer(attrs));
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
