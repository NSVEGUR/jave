import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const role = url.pathname.split('/')[1];
	return {
		user: locals.user,
		role,
		url: url.pathname
	};
};
