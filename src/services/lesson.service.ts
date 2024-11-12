import { Lesson } from '../models/Lessons';
import db from '../config/db';
import logger from '../config/logger';
import { CreateLessonDto } from '../dto/create-lessons.dto';
import { UpdateLessonDto } from '../dto/update-lessons.dto';

class LessonService {
    async getLessonsByFilter(filterConditions: any, page: number = 1, lessonsPerPage: number = 5): Promise<Lesson[]> {
        try {
            const query = db('lessons')
                .distinct('lessons.id')
                .leftJoin('lesson_students', 'lessons.id', '=', 'lesson_students.lesson_id')
                .leftJoin('lesson_teachers', 'lessons.id', '=', 'lesson_teachers.lesson_id')
                .leftJoin('teachers', 'lesson_teachers.teacher_id', '=', 'teachers.id')
                .select('lessons.*')
                .select(db.raw('COUNT(CASE WHEN lesson_students.visit = true THEN 1 ELSE NULL END) AS visitCount'))
                .groupBy('lessons.id', 'teachers.id');

            if (filterConditions.date) {
                if (filterConditions.date.$gte && filterConditions.date.$lte) {
                    query.whereBetween('lessons.date', [filterConditions.date.$gte, filterConditions.date.$lte]);
                } else {
                    query.where('lessons.date', '=', filterConditions.date);
                }
            }

            if (filterConditions.status !== undefined) {
                query.where('lessons.status', filterConditions.status);
            }

            if (filterConditions.teacherIds) {
                query.whereIn('lesson_teachers.teacher_id', filterConditions.teacherIds);
            }

            if (filterConditions.studentsCount) {
                if (
                    filterConditions.studentsCount.$gte !== undefined &&
                    filterConditions.studentsCount.$lte !== undefined
                ) {
                    query
                        .having(
                            db.raw('COUNT("lesson_students"."student_id")'),
                            '>=',
                            filterConditions.studentsCount.$gte
                        )
                        .having(
                            db.raw('COUNT("lesson_students"."student_id")'),
                            '<=',
                            filterConditions.studentsCount.$lte
                        );
                } else {
                    query.having(db.raw('COUNT("lesson_students"."student_id")'), '=', filterConditions.studentsCount);
                }
            }

            const offset = (page - 1) * lessonsPerPage;
            const lessons = await query.offset(offset).limit(lessonsPerPage);
            console.log(lessons);
            const lessonsWithStudents = await Promise.all(
                lessons.map(async (lesson) => {
                    const students = await db('students')
                        .leftJoin('lesson_students', 'students.id', '=', 'lesson_students.student_id')
                        .where('lesson_students.lesson_id', '=', lesson.id)
                        .select('students.id as student_id', 'students.name as student_name');

                    const teachers = await db('teachers')
                        .leftJoin('lesson_teachers', 'teachers.id', '=', 'lesson_teachers.teacher_id')
                        .where('lesson_teachers.lesson_id', '=', lesson.id)
                        .select('teachers.id as teacher_id', 'teachers.name as teacher_name');

                    return {
                        id: lesson.id,
                        date: lesson.date,
                        title: lesson.title,
                        status: lesson.status,
                        visitCount: lesson.visitcount,
                        students: students.map((student) => ({
                            id: student.student_id,
                            name: student.student_name
                        })),
                        teachers: [
                            teachers.map((teacher) => ({
                                id: teacher.teacher_id,
                                name: teacher.teacher_name
                            }))
                        ]
                    };
                })
            );

            logger.info('Fetched all lessons by filter success');
            return lessonsWithStudents;
        } catch (error) {
            logger.error(`Error get lessons by filter:\n`, error);
            throw new Error('Could not filter lessons');
        }
    }

    async getAllLessons(): Promise<Lesson[]> {
        try {
            const lessons = await db('lessons').returning('*');
            logger.info('Fetched all lessons success');
            return lessons;
        } catch (error) {
            logger.error('Error get lessons:', error);
            throw new Error('Could not get lessons');
        }
    }

    async createLesson(dto: CreateLessonDto): Promise<Lesson | null> {
        try {
            const [newLesson] = await db('lessons').insert(dto).returning('*');
            logger.info('Create Lessons success');
            return newLesson;
        } catch (error) {
            logger.error('Error creating lesson:', error);
            throw new Error('Could not create lesson');
        }
    }

    async getLessonById(id: number): Promise<Lesson | null> {
        try {
            const lesson = await db('lessons').where({ id }).first();
            if (!lesson) {
                logger.warn(`Запись с id ${id} не найдена в таблице lessons`);
                return null;
            }
            logger.info('Fetch Lesson by id success');
            return lesson;
        } catch (error) {
            logger.error('Error fetching lesson:', error);
            throw new Error('Could not fetch lesson');
        }
    }

    async updateLesson(id: number, dto: UpdateLessonDto): Promise<Lesson | null> {
        try {
            const [updatedLesson] = await db('lessons').where({ id }).update(dto).returning('*');
            if (!updatedLesson) {
                logger.warn(`Запись с id ${id} не найдена в таблице lessons`);
                return null;
            }
            logger.info('Update lessons success');
            return updatedLesson;
        } catch (error) {
            logger.error('Error updating lesson:', error);
            throw new Error('Could not update lesson');
        }
    }

    async deleteLesson(id: number): Promise<void> {
        try {
            return await db('lessons').where({ id }).del();
        } catch (error) {
            logger.error('Error deleting lesson:', error);
            throw new Error('Could not delete lesson');
        }
    }
}

export const lessonService = new LessonService();
