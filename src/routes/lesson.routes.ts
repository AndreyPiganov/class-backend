import { Router } from 'express';
import { lessonController } from '../controllers/lesson.controller';
import { filterValidator } from 'src/validators/filter.validator';
import { createLessonValidator } from 'src/validators/create-lesson.validator';
import { updateLessonValidator } from 'src/validators/update-lesson.validator';

const router = Router();

router.get('/', lessonController.getAllLessons);

router.get('/filter', [...filterValidator], lessonController.getLessonsByFilter);

router.get('/:id', lessonController.getLessonById);

router.post('/', [...createLessonValidator], lessonController.createLesson);

router.put('/:id', [...updateLessonValidator], lessonController.updateLesson);

router.delete('/:id', lessonController.deleteLesson);

export default router;
