import { sqliteService } from '../database/SQLiteDatabase';
import { QuestionsGroupService } from './QuestionsGroupService';
import { QuestionsService } from './QuestionService';
import { QuestionAnswerService } from './QuestionAnswerService';

export const questionsGroupService = new QuestionsGroupService(sqliteService);
export const questionsService = new QuestionsService(sqliteService);
export const questionAnswerService = new QuestionAnswerService(sqliteService);
