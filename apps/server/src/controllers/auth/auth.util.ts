import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';

async function hashPassword(
	password: string,
	salt: number = 12
) {
	return await bcrypt.hash(password, salt);
}

async function validPassword(
	currentPassword: string,
	password: string
) {
	return await bcrypt.compare(currentPassword, password);
}

function signToken(payload: {
	id: string;
	email: string;
	name: string;
	role: string;
}) {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			config.JWT_KEY,
			{
				expiresIn: config.JWT_EXPIRES_IN
			},
			(err, token) => {
				if (err) return reject(err);
				return resolve(token);
			}
		);
	});
}

function verifyToken(token: string) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.JWT_KEY, (err, token) => {
			if (err) return reject(err);
			return resolve(token);
		});
	});
}

export default {
	validPassword,
	hashPassword,
	signToken,
	verifyToken
};
