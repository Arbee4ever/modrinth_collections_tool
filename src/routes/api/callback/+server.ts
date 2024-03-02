import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, url}) => {
	const returnCode = url.searchParams.get("code")?.toString();

	if (returnCode == null) {
		return error(400, "Invalid return Code");
	}

	const dataObject = {
		client_id: env.MODRINTH_CLIENT_ID,
		redirect_uri: env.MODRINTH_REDIRECT_URI,
		grant_type: 'authorization_code',
		code: returnCode
	};

	const request = await fetch('https://api.modrinth.com/_internal/oauth/token', {
		method: 'POST',
		body: new URLSearchParams(dataObject),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded', "Authorization": env.MODRINTH_CLIENT_SECRET }
	});

	if (request.status != 200) {
		return new Response(await request.text(), { status: request.status })
	}

	const response = await request.json();

	const access_token_expires_in = new Date(Date.now() + response.expires_in);
	cookies.set('modrinth_access_token', response.access_token, {
		secure: !dev,
		httpOnly: true,
		path: '/',
		expires: access_token_expires_in
	});
	throw redirect(302, '/')
}