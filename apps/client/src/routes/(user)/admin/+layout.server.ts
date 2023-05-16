import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	//If not logged in redirect the user
	if (!locals.user || locals.user.role !== 'admin') {
		throw redirect(302, `/admin/login`);
	}
};
