import { sqliteService } from '../database/SQLiteDatabase';
import { QuestionsGroupService } from './QuestionsGroupService';
import { QuestionsService } from './QuestionService';
import { QuestionAnswerService } from './QuestionAnswerService';
import { QuestionStudentService } from './QuestionStudentService';
import { ProfileUserService } from './ProfileUserService';

export const questionsGroupService = new QuestionsGroupService(sqliteService);
export const questionsService = new QuestionsService(sqliteService);
export const questionAnswerService = new QuestionAnswerService(sqliteService);
export const questionStudentService = new QuestionStudentService(sqliteService);
export const profileUserService = new ProfileUserService(sqliteService);