import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync.util';

import AppError from '../utils/appError.util';
import { prisma } from '../../prisma';
import { Timestamp } from '@prisma/client';

const upload = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const filmBody = JSON.parse(req.body.filmBody);
	const characterBody = JSON.parse(
		req.body.characterBody
	);
	const { type } = req.body;
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
			thumbnailId: filmThumbnail.id,
			type
		}
	});
	// Characters and their details
	for (const [
		index,
		characterObj
	] of characterBody.entries()) {
		if (image.length <= index) {
			return next(
				new AppError(
					'Character data is received but no image has been uploaded to show the character',
					400
				)
			);
		}
		let file: Express.Multer.File | undefined;
		let characterFileId: string | undefined;
		if (type === 'JAVE') {
			if (character.length <= index) {
				return next(
					new AppError(
						'Character data is received but no image has been uploaded to show the character',
						400
					)
				);
			}
			// Creating character video file
			file = character[index];
			await prisma.file.create({
				data: {
					id: file.filename,
					name: file.originalname,
					mimetype: file.mimetype,
					size: file.size
				}
			});
			characterFileId = file.filename;
		}
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
		const newCharacter = await prisma.character.create({
			data: {
				name: characterObj.name,
				description: characterObj.description,
				filmId: newFilm.id,
				fileId: characterFileId,
				imageId: characterImage.id
			}
		});
		if (type === 'JAVE') {
			const timestamps =
				characterObj.timestamps as Timestamp[];
			for (const timestamp of timestamps) {
				await prisma.timestamp.create({
					data: {
						characterId: newCharacter.id,
						start: timestamp.start,
						end: timestamp.end
					}
				});
			}
		}
	}
	return res.status(201).json({
		status: 201,
		message: 'Created Film successfully',
		success: true
	});
});

const getAll = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const films = await prisma.film.findMany({});
	return res.status(200).json({
		message: 'Fetched all films successfully',
		success: true,
		status: 200,
		data: {
			films: films.map((film) => {
				return {
					id: film.id,
					title: film.title,
					genre: film.genre,
					type: film.type,
					description: film.description,
					fileId: film.fileId,
					thumbnailId: film.thumbnailId
				};
			})
		}
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
			file: true,
			characters: true
		}
	});
	if (!film) {
		return next(new AppError('Film not found', 404));
	}
	return res.status(200).json({
		status: 200,
		message: 'Fetched film details successfully',
		success: true,
		data: {
			film: {
				id: film.id,
				type: film.type,
				title: film.title,
				characters: film.characters,
				genre: film.genre,
				fileId: film.fileId,
				description: film.description,
				size: film.file.size,
				mimetype: film.file.mimetype,
				createdAt: film.file.createdAt,
				thumbnailId: film.thumbnailId
			}
		}
	});
});

export default {
	upload,
	get,
	getAll
};
