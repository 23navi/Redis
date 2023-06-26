import { client } from '$services/redis';
import { pageCacheKey } from '$services/keys';

const cacheableRoutes = ['/about', '/privacy'];

export const getCachedPage = (route: string) => {
	if (cacheableRoutes.includes(route)) {
		return client.get(pageCacheKey(route));
	}
	return null;
};

export const setCachedPage = (route: string, page: string) => {
	if (cacheableRoutes.includes(route)) {
		return client.set(pageCacheKey(route), page, {
			EX: 60 * 60 * 24 * 7 // one week
		});
	}

	return null;
};
