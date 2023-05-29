import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.util';
import { prisma } from '../../prisma';
import { catchAsync } from '../utils/catchAsync.util';

const get = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { characterId } = req.params;
	const character = await prisma.character.findUnique({
		where: { id: characterId },
		include: {
			file: true,
			timestamps: true
		}
	});

	if (!character) {
		return next(new AppError('Film not found', 404));
	}
	const film = await prisma.film.findUnique({
		where: {
			id: character.filmId
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
			character: {
				id: character.id,
				name: character.name,
				fileId: character.fileId,
				genre: film.genre,
				filmId: film.id,
				type: film.type,
				description: character.description,
				size: character.file?.size,
				mimetype: character.file?.mimetype,
				createdAt: character.file?.createdAt,
				imageId: character.imageId,
				timestamps: character.timestamps
			}
		}
	});
});

export default { get };
