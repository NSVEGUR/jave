import type { RequestHandler } from './$types';
import { API_ADDRESS } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const GET = async function ({ fetch, params, request }) {
	const response = await fetch(`${API_ADDRESS}/film/${params.filmId}`, {
		headers: {
			range: request.headers.get('range') || 'bytes=0-'
		}
	});
	if (response.ok) {
		return response;
	} else {
		throw error(response.status, { message: response.statusText });
	}
} satisfies RequestHandler;
