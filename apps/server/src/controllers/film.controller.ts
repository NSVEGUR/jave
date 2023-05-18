import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync.util';
import AppError from '../utils/appError.util';
import { prisma } from '../../prisma';
import { Character, Film } from '@prisma/client';

const upload = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const filmBody = JSON.parse(req.body.filmBody);
	const characterBody = JSON.parse(
		req.body.characterBody
	);
	const files = req.files as
		| {
				[fieldname: string]: Express.Multer.File[];
		  }
		| undefined;
	if (!files) {
		return next(
			new AppError(
				'No files found in the request body',
				404
			)
		);
	}
	const { film, thumbnail, character, image } = files;
	// Creating main video file for film
	const filmFile = await prisma.file.create({
		data: {
			id: film[0].filename,
			name: film[0].originalname,
			mimetype: film[0].mimetype,
			size: film[0].size
		}
	});
	// Creating thumbnail file for film
	const filmThumbnail = await prisma.file.create({
		data: {
			id: thumbnail[0].filename,
			name: thumbnail[0].originalname,
			mimetype: thumbnail[0].mimetype,
			size: thumbnail[0].size
		}
	});
	// Storing the main film details in database
	const newFilm = await prisma.film.create({
		data: {
			title: filmBody.title,
			description: filmBody.description,
			genre: filmBody.genre,
			fileId: filmFile.id,
			thumbnailId: filmThumbnail.id
		}
	});
	// Characters and their details
	for (const [
		index,
		characterObj
	] of characterBody.entries()) {
		if (
			character.length <= index ||
			image.length <= index
		) {
			return next(
				new AppError(
					'Character data is received but no video or thumbnail has been uploaded',
					400
				)
			);
		}
		// Creating character video file
		let file = character[index];
		const characterFile = await prisma.file.create({
			data: {
				id: file.filename,
				name: file.originalname,
				mimetype: file.mimetype,
				size: file.size
			}
		});
		// Creating character thumbnail file
		file = image[index];
		const characterImage = await prisma.file.create({
			data: {
				id: file.filename,
				name: file.originalname,
				mimetype: file.mimetype,
				size: file.size
			}
		});
		await prisma.character.create({
			data: {
				name: characterObj.name,
				description: characterObj.description,
				timestamps: characterObj.timestamps,
				filmId: newFilm.id,
				fileId: characterFile.id,
				imageId: characterImage.id
			}
		});
	}
	return res.status(201).json({
		message: 'Created Film successfully',
		success: true
	});
});

const get = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { filmId } = req.params;
	const film = await prisma.film.findUnique({
		where: { id: filmId },
		include: {
			file: true
		}
	});
	if (!film) {
		return next(new AppError('Film not found', 404));
	}
	const data = {
		id: film.id,
		title: film.title,
		genre: film.description,
		description: film.description,
		size: film.file.size,
		mimetype: film.file.mimetype,
		createdAt: film.file.createdAt,
		thumbnailId: film.thumbnailId
	};
	return res.status(200).json({
		message: 'Fetched film details successfully',
		success: true,
		data
	});
});

export default {
	upload,
	get
};
