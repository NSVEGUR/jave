import { Request, Response, NextFunction } from 'express';
import config from '../config';

const errorDev = (err: any, res: Response) => {
	console.log(err.message);
	res.status(err.statusCode).json({
		status: err.statusCode,
		error: err,
		success: false,
		message: err.message,
		stack: err.stack
	});
};

const errorProd = (err: any, res: Response) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			success: false,
			status: err.statusCode,
			message: err.message
		});
	} else {
		console.error('ERROR! 💥💥💥', err);
		res.status(500).json({
			success: false,
			status: 500,
			message:
				'Something went wrong, server side error:('
		});
	}
};

export default function errorController(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';
	if (config.NODE_ENV == 'development') {
		errorDev(err, res);
	} else {
		errorProd(err, res);
	}
}
