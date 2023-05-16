import { redirect, type Actions } from '@sveltejs/kit';
import { COOKIE } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.delete(COOKIE, {
		path: '/'
	});
	throw redirect(303, '/');
};

export const actions = {
	default: async ({ cookies }) => {
		cookies.delete(COOKIE, {
			path: '/'
		});
		throw redirect(303, '/');
	}
} satisfies Actions;
