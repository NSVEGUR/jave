import type { Actions } from './$types';
import { API_ADDRESS } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const actions: Actions = {
	upload: async function ({ request, fetch }) {
		const data = await request.formData();
		const form = new FormData();
		form.append('film', data.get('film') as Blob);
		form.append('thumbnail', data.get('thumbnail') as Blob);
		form.append('filmBody', data.get('filmBody') as string);
		for (const file of data.getAll('character') as Blob[]) {
			form.append('character', file);
		}
		for (const file of data.getAll('image') as Blob[]) {
			form.append('image', file);
		}
		for (const file of data.getAll('characterBody') as string[]) {
			form.append('characterBody', file);
		}
		form.append('type', data.get('type') as string);
		const response = await fetch(`${API_ADDRESS}/admin/film`, {
			body: form,
			method: 'POST'
		});
		const result = await response.json();
		if (response.status >= 200 && response.status < 400) {
			return {
				success: true
			};
		} else {
			throw error(response.status, { message: result.message });
		}
	}
};
