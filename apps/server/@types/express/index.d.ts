import {
	Service,
	User,
	Mail,
	UsersMail,
	File,
	Folder
} from '@prisma/client';

declare global {
	namespace Express {
		interface Request {
			user: User;
			dbFile: File;
			dbFolder: Folder;
		}
	}
}

export {};
