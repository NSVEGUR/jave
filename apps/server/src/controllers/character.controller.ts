import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError.util';
import { prisma } from '../../prisma';
import catchAsync from '../utils/catchAsync.util';

const get = catchAsync(async function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { characterId } = req.params;
	const character = await prisma.character.findUnique({
		where: { id: characterId },
		include: {
			file: true
		}
	});
	if (!character) {
		return next(new AppError('Film not found', 404));
	}
	const data = {
		id: character.id,
		name: character.name,
		description: character.description,
		size: character.file.size,
		mimetype: character.file.mimetype,
		createdAt: character.file.createdAt,
		imageId: character.imageId
	};
	return res.status(200).json({
		message: 'Fetched film details successfully',
		success: true,
		data
	});
});

export default { get };
