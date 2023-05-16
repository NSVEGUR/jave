import { Router } from 'express';
import File from '../controllers/file.controller';
import Film from '../controllers/film.controller';
import Character from '../controllers/character.controller';

const router = Router();

router.get('/:videoId', File.getVideo);
router.get('/:thumbnailId/thumbnail', File.getThumbnail);
router.get('/:filmId/metadata', Film.get);
router.get(
	'/character/:characterId/metadata',
	Character.get
);

export default router;
