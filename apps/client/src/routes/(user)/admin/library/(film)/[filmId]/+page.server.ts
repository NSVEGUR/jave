import { API_ADDRESS } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const response = await fetch(API_ADDRESS + `/film/${params.filmId}/metadata`);
	const result = await response.json();
	if (result.status >= 200 && result.status < 300) {
		const { data } = result;
		const film = data.film as App.Film;
		return { film };
	}
	throw error(result.status, { message: result.message });
};
