import multer from 'multer';
import config from '../config';
import Crypto from './crypto.util';

const storage = multer.diskStorage({
	destination(req, file, callback) {
		callback(null, config.FILE_STORE);
	},
	filename(req, file, callback) {
		const fileName = `${
			req.user.id
		}$${Crypto.crypticRandomBytes(
			5
		)}$${Date.now()}.${file.originalname
			.split('.')
			.pop()}`;
		callback(null, fileName);
	}
});

export const video_mimetype = new Set([
	'video/mp4',
	'video/webm',
	'video/x-m4v',
	'video/quicktime',
	'video/x-matroska',
	'video/mpeg	',
	'video/x-mpeg',
	'video/3gpp',
	'video/3gpp2',
	'video/msvideo',
	'video/ogg',
	'video/avi'
]);

export const image_mimetype = new Set([
	'image/png',
	'image/jpg',
	'image/jpeg',
	'image/svg+xml'
]);

const uploadVideo = multer({
	storage,
	fileFilter(req, file, callback) {
		const { fieldname } = file;
		if (
			fieldname === 'film' ||
			fieldname === 'character'
		) {
			if (!video_mimetype.has(file.mimetype)) {
				callback(null, false);
				return callback(
					new Error(
						`Only ${video_mimetype} mimetype are allowed for video`
					)
				);
			}
		} else {
			if (!image_mimetype.has(file.mimetype)) {
				callback(null, false);
				return callback(
					new Error(
						`Only ${image_mimetype} mimetype are allowed for image`
					)
				);
			}
		}
		callback(null, true);
	}
});

const upload = multer({ storage });

export { uploadVideo, upload };
