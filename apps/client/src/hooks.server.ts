import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit';
import * as Sentry from '@sentry/node';
import { BrowserTracing } from '@sentry/tracing';
import { getUserInformation } from '$lib/server/info';
import { API_ADDRESS, API_KEY, COOKIE } from '$env/static/private';

Sentry.init({
	integrations: [new BrowserTracing()],
	tracesSampleRate: 1.0
});

export const handle = async function ({ event, resolve }) {
	const token = event.cookies.get(COOKIE);
	if (token) {
		try {
			event.locals.user = await getUserInformation(token);
		} catch (err) {
			console.error(err);
		}
	}
	const response = await resolve(event);
	return response;
} satisfies Handle;

export const handleFetch = (({ fetch, request, event }) => {
	if (request.url.startsWith(API_ADDRESS)) {
		const token = event.cookies.get(COOKIE);
		request.headers.set('Authorization', `Bearer ${token}`);
		request.headers.set('X-API-KEY', API_KEY);
	}
	return fetch(request);
}) satisfies HandleFetch;

export const handleError = (async ({ error }) => {
	console.error(error);
	Sentry.captureException(error);
}) satisfies HandleServerError;
