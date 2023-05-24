import type { PageServerLoad } from './$types';
import { API_ADDRESS } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(API_ADDRESS + '/film');
	const result = await response.json();
	if (result.status >= 200 && result.status < 300) {
		const { data } = result;
		const films = data.films as App.Film[];
		return {
			films
		};
	}
	throw error(result.status, { message: result.message });
};
