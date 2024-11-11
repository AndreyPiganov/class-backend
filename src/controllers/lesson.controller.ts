import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CreateLessonDto } from '../dto/create-lessons.dto';
import { UpdateLessonDto } from '../dto/update-lessons.dto';
import { lessonService } from '../services/lesson.service';
import logger from '../config/logger'; // Подключение логгера
import { FilterParams } from './filters/ifilter.params';
import { Filter } from './filters/filter';

class LessonController {
    async getLessonsByFilter(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            const filterParams: FilterParams = req.query;
            if (!filterParams) {
                throw new Error('filter params not provided');
            }
            const filter = new Filter(filterParams);
            const filterOptions = filter.getFilterOptions();
            const lessons = await lessonService.getLessonsByFilter(
                filterOptions,
                filterParams.page,
                filterParams.lessonsPerPage
            );
            res.status(200).json(lessons);
        } catch (error) {
            logger.error('Error get lessons by filter:', error);
            res.status(500).json({ message: 'Could not retrieve lessons by filter' });
        }
    }

    async getAllLessons(_: Request, res: Response) {
        try {
            const lessons = await lessonService.getAllLessons();
            res.status(200).json(lessons);
        } catch (error) {
            logger.error('Error retrieving lessons:', error);
            res.status(500).json({ message: 'Could not retrieve lessons' });
        }
    }

    async createLesson(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const dto: CreateLessonDto = req.body;

        try {
            const newLesson = await lessonService.createLesson(dto);
            if (!newLesson) {
                res.status(400).json({ message: 'Failed to create lesson' });
                return;
            }
            res.status(201).json(newLesson);
        } catch (error) {
            logger.error('Error creating lesson:', error);
            res.status(500).json({ message: 'Error creating lesson' });
        }
    }

    async getLessonById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const lesson = await lessonService.getLessonById(Number(id));
            if (!lesson) {
                logger.warn(`Lesson with ID ${id} not found`);
                res.status(404).json({ message: 'Lesson not found' });
                return;
            }
            res.status(200).json(lesson);
        } catch (error) {
            logger.error(`Error fetching lesson with ID ${id}:`, error);
            res.status(500).json({ message: 'Error fetching lesson' });
        }
    }

    async updateLesson(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { id } = req.params;
        const dto: UpdateLessonDto = req.body;

        try {
            const updatedLesson = await lessonService.updateLesson(Number(id), dto);
            if (updatedLesson) {
                res.status(200).json(updatedLesson);
            } else {
                logger.warn(`Lesson with ID ${id} not found for update`);
                res.status(404).json({ message: 'Lesson not found' });
            }
        } catch (error) {
            logger.error(`Error updating lesson with ID ${id}:`, error);
            res.status(500).json({ message: 'Error updating lesson' });
        }
    }

    async deleteLesson(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await lessonService.deleteLesson(Number(id));
            res.status(204).send();
        } catch (error) {
            logger.error(`Error deleting lesson with ID ${id}:`, error);
            res.status(500).json({ message: 'Error deleting lesson' });
        }
    }
}

export const lessonController = new LessonController();
