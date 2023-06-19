import type { Session } from '$services/types';
import { client } from '$services/redis';
import { sessionsKey } from '$services/keys';

export const getSession = async (sessionId: string) => {
	const session = await client.hGetAll(sessionsKey(sessionId));
	console.log('session: ' + JSON.stringify(session));

	if (Object.keys(session).length === 0) {
		return null;
	}

	return sessionDeserializer(sessionId, session);
};

export const saveSession = async (session: Session) => {
	console.log('session: ' + JSON.stringify(session));
	const { id } = session;
	return await client.hSet(sessionsKey(id), sessionSerializer(session));
};

const sessionDeserializer = (sessionId: string, session: { [key: string]: string }) => {
	return {
		id: sessionId,
		userId: session.userId,
		username: session.username
	};
};

const sessionSerializer = (session: Session) => {
	return {
		userId: session.userId,
		username: session.username
	};
};
