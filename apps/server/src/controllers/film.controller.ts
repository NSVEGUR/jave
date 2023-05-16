import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync.util';
import AppError from '../utils/appError.util';
import { prisma } from '../../prisma';
import { Character, Film } from '@prisma/client';

const upload = catchAsync(async function (
	req: Request<
		{},
		{},
		{ film: Film; characters: Character[] }
	>,
	res: Response,
	next: NextFunction
) {
	const { film: filmBody, characters: charactersBody } =
		req.body;
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
	const {
		film: filmFiles,
		filmThumbnail: filmThumbnailFiles,
		character: characterFiles,
		characterThumbnail: characterThumbnailFiles
	} = files;
	// Creating main video file for film
	const filmFile = await prisma.file.create({
		data: {
			id: filmFiles[0].filename,
			name: filmFiles[0].originalname,
			mimetype: filmFiles[0].mimetype,
			size: filmFiles[0].size
		}
	});
	// Creating thumbnail file for film
	const filmThumbnailFile = await prisma.file.create({
		data: {
			id: filmThumbnailFiles[0].filename,
			name: filmThumbnailFiles[0].originalname,
			mimetype: filmThumbnailFiles[0].mimetype,
			size: filmThumbnailFiles[0].size
		}
	});
	// Storing the main film details in database
	const newFilm = await prisma.film.create({
		data: {
			title: filmBody.title,
			description: filmBody.description,
			genre: filmBody.genre,
			fileId: filmFile.id,
			thumbnailId: filmThumbnailFile.id
		}
	});
	// Characters and their details
	for (const [
		index,
		characterBody
	] of charactersBody.entries()) {
		if (
			characterFiles.length <= index ||
			characterThumbnailFiles.length <= index
		) {
			return next(
				new AppError(
					'Character data is received but no file has been uploaded',
					400
				)
			);
		}
		// Creating character video file
		let file = characterFiles[index];
		const characterFile = await prisma.file.create({
			data: {
				id: file.filename,
				name: file.originalname,
				mimetype: file.mimetype,
				size: file.size
			}
		});
		// Creating character thumbnail file
		file = characterThumbnailFiles[index];
		const characterThumbnailFile =
			await prisma.file.create({
				data: {
					id: file.filename,
					name: file.originalname,
					mimetype: file.mimetype,
					size: file.size
				}
			});
		await prisma.character.create({
			data: {
				title: characterBody.title,
				description: characterBody.description,
				timestamps: characterBody.timestamps,
				filmId: newFilm.id,
				fileId: characterFile.id,
				thumbnailId: characterThumbnailFile.id
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
