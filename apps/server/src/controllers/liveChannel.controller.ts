import { catchAsync } from '../utils/catchAsync.util';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma';
import AppError from '../utils/appError.util';

const upload = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { name, url } = req.body;
	const files = req.files as Express.Multer.File[];
	if (files.length <= 0) {
		return next(
			new AppError(
				'No files found in the request body',
				404
			)
		);
	}
	const file = files[0];
	await prisma.file.create({
		data: {
			id: file.filename,
			name: file.originalname,
			mimetype: file.mimetype,
			size: file.size
		}
	});
	const liveChannel = await prisma.liveChannel.create({
		data: {
			name,
			url,
			logoId: file.filename
		}
	});
	res.status(201).json({
		success: true,
		status: 201,
		message: 'Uploaded live channel successfully',
		data: {
			liveChannel
		}
	});
});

const getAll = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const liveChannels = await prisma.liveChannel.findMany({
		include: { logo: true }
	});
	res.status(200).json({
		success: true,
		status: 200,
		message:
			'Fetched all the live channels successfully',
		data: {
			liveChannels
		}
	});
});

const get = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { liveChannelId } = req.params;
	const liveChannel = await prisma.liveChannel.findUnique(
		{
			where: { id: liveChannelId },
			include: { logo: true }
		}
	);
	res.status(200).json({
		success: true,
		status: 200,
		message: 'Fetched live channel successfully',
		data: {
			liveChannel
		}
	});
});

const update = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { liveChannelId } = req.params;
	const { name, url } = req.body;
	let liveChannel = await prisma.liveChannel.findUnique({
		where: {
			id: liveChannelId
		},
		include: {
			logo: true
		}
	});
	if (!liveChannel) {
		return next(
			new AppError('Live channel not found', 404)
		);
	}
	liveChannel = await prisma.liveChannel.update({
		where: {
			id: liveChannelId
		},
		data: {
			name,
			url
		},
		include: {
			logo: true
		}
	});
	const files = req.files as Express.Multer.File[];
	if (files.length > 0) {
		const file = files[0];
		await prisma.file.delete({
			where: {
				id: liveChannel.logoId
			}
		});
		await prisma.file.create({
			data: {
				id: file.filename,
				mimetype: file.mimetype,
				size: file.size,
				name: file.originalname
			}
		});
		await prisma.liveChannel.update({
			where: {
				id: liveChannel.id
			},
			data: {
				logoId: file.filename
			}
		});
	}
	return res.status(200).json({
		success: true,
		status: 200,
		message: 'Updated live channel successfully',
		data: {
			liveChannel
		}
	});
});

const remove = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { liveChannelId } = req.params;
	const liveChannel = await prisma.liveChannel.findUnique(
		{
			where: { id: liveChannelId }
		}
	);
	if (!liveChannel) {
		return next(
			new AppError('Live channel not found', 404)
		);
	}
	await prisma.file.delete({
		where: {
			id: liveChannel.logoId
		}
	});
	await prisma.liveChannel.delete({
		where: { id: liveChannelId }
	});
	res.status(204).json({
		status: 204,
		success: true,
		message: 'Deleted live channel successfully',
		data: null
	});
});

export default {
	upload,
	getAll,
	get,
	update,
	remove
};
