import jwt from 'jsonwebtoken';
import { JWT_KEY } from '$env/static/private';

export const getUserInformation = async function (token: string) {
	const payload = (await new Promise((resolve, reject) => {
		jwt.verify(token, JWT_KEY, (err, token) => {
			if (err) return reject(err);
			return resolve(token);
		});
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	})) as any;
	return {
		email: payload.email,
		name: payload.name,
		role: `${payload.role}`.toLowerCase()
	};
};
