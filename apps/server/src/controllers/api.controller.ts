import { Request, Response, NextFunction } from 'express';
import config from '../config';
import AppError from '../utils/appError.util';

const protect = async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!req.headers.hasOwnProperty('x-api-key'))
		return next(new AppError('Not Authorized', 401));
	const key = req.headers['x-api-key'];
	if (key != config.API_KEY)
		return next(new AppError('Not Authorized', 401));
	next();
};

export default {
	protect
};
