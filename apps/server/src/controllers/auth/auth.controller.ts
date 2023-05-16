import { Role, User } from '@prisma/client';
import catchAsync from '../../utils/catchAsync.util';
import { NextFunction, Request, Response } from 'express';
import Auth from './auth.util';
import Crypto from '../../utils/crypto.util';
import AppError from '../../utils/appError.util';
import { prisma } from '../../../prisma';

const protect = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	let token = '';
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (!token)
		return next(
			new AppError(
				`You're not logged in! Please login to access`,
				401
			)
		);
	const decoded = (await Auth.verifyToken(token)) as any;
	if (!decoded || !decoded.id)
		return next(new AppError('User not found', 404));
	const user = await prisma.user.findUnique({
		where: {
			uid: decoded.id
		}
	});
	if (!user || user.role !== decoded.role)
		return next(new AppError('User not found', 404));
	req.user = user;
	next();
});

const signup = catchAsync(async function (
	req: Request<{}, {}, User>,
	res: Response,
	next: NextFunction
) {
	const { email, password, role } = req.body;
	if (!email || !password || !role) {
		return next(
			new AppError('Incomplete information', 400)
		);
	}
	if (
		req.originalUrl.split('/')[3] != role.toLowerCase()
	) {
		return next(
			new AppError('Authorization error', 401)
		);
	}
	await prisma.user.create({
		data: {
			uid: Crypto.crypticRandomUUID(),
			email: email,
			name: email[0].toUpperCase() + email.slice(1),
			password: await Auth.hashPassword(password),
			role: role
		}
	});
	return res.status(201).json({
		status: 201,
		message: 'Signed up successfully'
	});
});

const login = catchAsync(async function (
	req: Request<{}, {}, User>,
	res: Response,
	next: NextFunction
) {
	const { email, password, role } = req.body;
	if (!email || !password || !role) {
		return next(
			new AppError('Incomplete information', 400)
		);
	}
	if (
		req.originalUrl.split('/')[3] != role.toLowerCase()
	) {
		return next(
			new AppError('Authorization error', 401)
		);
	}
	const user = await prisma.user.findUnique({
		where: {
			email: email
		}
	});
	if (
		!user ||
		user.role != role ||
		!(await Auth.validPassword(password, user.password))
	) {
		return next(
			new AppError('Invalid email or password', 404)
		);
	}
	const updatedUser = await prisma.user.update({
		where: {
			uid: user.uid
		},
		data: {
			uid: Crypto.crypticRandomUUID()
		}
	});
	const token = await Auth.signToken({
		id: updatedUser.uid,
		email: updatedUser.email,
		name: updatedUser.name,
		role: updatedUser.role
	});
	return res.status(200).json({
		status: 200,
		message: 'Logged in successfully',
		data: {
			user: {
				token: token,
				email: updatedUser.email,
				role: updatedUser.role
			}
		}
	});
});

const get = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { user } = req;
	return res.status(200).json({
		status: 200,
		message: 'User found',
		data: {
			user: {
				email: user.email,
				role: user.role
			}
		}
	});
});

const adminProtect = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { user } = req;
	if (user.role !== Role.ADMIN) {
		return next(
			new AppError(
				'You have no access to this route',
				403
			)
		);
	}
	next();
});

export default {
	protect,
	signup,
	login,
	get,
	adminProtect
};
