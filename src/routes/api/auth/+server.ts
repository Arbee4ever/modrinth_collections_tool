import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response('', {
		headers: {
			Location: `https://modrinth.com/auth/authorize?client_id=${env.MODRINTH_CLIENT_ID}&redirect_uri=${env.MODRINTH_REDIRECT_URI}&scope=COLLECTION_READ+USER_READ`
		},
		status: 302
	});
}