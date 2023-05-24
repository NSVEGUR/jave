import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { API_ADDRESS, COOKIE } from '$env/static/private';

export const load: PageServerLoad = async ({ locals }) => {
	//If logged in redirect the user
	if (locals.user && locals.user.role === 'admin') {
		throw redirect(302, '/admin');
	}
	return {
		user: locals.user
	};
};

export const actions = {
	login: async ({ request, cookies, fetch }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
			return fail(400, { error: 'Invalid form' });
		}
		const data = {
			email,
			password,
			role: 'ADMIN'
		};
		const response = await fetch(`${API_ADDRESS}/admin/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		const result = await response.json();
		if (result.status === 200) {
			const { user } = result.data;
			cookies.set(COOKIE, user.token, {
				path: '/'
			});
			throw redirect(302, '/admin');
		}
		if (`${result.status}`.startsWith('4')) {
			return fail(400, { error: 'Invalid email or password' });
		}
		if (`${result.status}`.startsWith('5')) {
			return fail(500, { error: 'Unknown error occurred' });
		}
		throw error(response.status, { message: response.statusText });
	}
} satisfies Actions;
