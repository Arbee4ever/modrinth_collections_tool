import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	let user = null;
	let token = '';

	if (cookies.get('modrinth_access_token')) {
		const userReq = await fetch(`https://api.modrinth.com/v3/user`, {
			headers: { 'Authorization': `${cookies.get('modrinth_access_token')}` }
		});

		if (userReq.status !== 200) {
			throw error(userReq.status, userReq.statusText)
		}

		user = await userReq.json();
		token = cookies.get('modrinth_access_token');
	}
	return {
		user,
		token
	};
}