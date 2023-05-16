import { prisma } from '../../prisma';
import config from '../config';
import AppError from '../utils/appError.util';
import catchAsync from '../utils/catchAsync.util';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { video_mimetype } from '../utils/file.util';

const getVideo = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { videoId } = req.params;
	const video = await prisma.file.findUnique({
		where: {
			id: videoId
		}
	});
	if (!video || !video_mimetype.has(video.mimetype)) {
		return next(new AppError('Video not found', 404));
	}
	const path = `${config.FILE_STORE}/${video.id}`;
	const stat = fs.statSync(path);
	const size = stat.size;
	const range = req.headers.range;
	if (!range) {
		const head = {
			'Content-Length': size,
			'Content-Type': video.mimetype
		};
		const file = fs.createReadStream(path);
		res.writeHead(200, head);
		return file.pipe(res);
	}
	console.log('video range', range);
	const parts = range.replace(/bytes=/, '').split(' ');
	const start = parseInt(parts[0], 10);
	const end = parts[1]
		? parseInt(parts[1], 10)
		: size - 1;
	const chunkSize = end - start + 1;
	const head = {
		'Content-Length': chunkSize,
		'Content-Type': video.mimetype,
		'Accept-Ranges': 'bytes',
		'Content-Range': `bytes ${start}-${end}/${size}`
	};
	const file = fs.createReadStream(path, { start, end });
	res.writeHead(206, head);
	return file.pipe(res);
});

const getThumbnail = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { thumbnailId } = req.params;
	const thumbnail = await prisma.file.findUnique({
		where: {
			id: thumbnailId
		}
	});
	if (!thumbnail) {
		return next(
			new AppError('Thumbnail not found', 404)
		);
	}
	return res.download(
		`${config.FILE_STORE}/${thumbnail.id}`,
		thumbnail.name,
		(err) => {
			if (err) {
				return next(err);
			}
		}
	);
});

export default {
	getVideo,
	getThumbnail
};
