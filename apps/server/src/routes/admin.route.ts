import { Router } from 'express';
import Auth from '../controllers/auth/auth.controller';
import Film from '../controllers/film.controller';
import { uploadVideo } from '../utils/file.util';

const router = Router();

router.post('/signup', Auth.signup);
router.post('/login', Auth.login);
router.use(Auth.protect);
router.use(Auth.adminProtect);
router.get('/', Auth.get);
router.post(
	'/film',
	uploadVideo.fields([
		{ name: 'film', maxCount: 1 },
		{ name: 'thumbnail', maxCount: 1 },
		{ name: 'character', maxCount: 25 },
		{ name: 'image', maxCount: 25 }
	]),
	Film.upload
);

export default router;
