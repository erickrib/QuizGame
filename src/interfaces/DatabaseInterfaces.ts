import { QuestionsGroup } from "../models/QuestionsGroup";
import { Question } from "../models/Question";
import { QuestionAnswer } from "../models/QuestionAnswer";

import { CreateQuestionParams } from "../services/QuestionService";
import { CreateQuestionsGroupParams } from "../services/QuestionsGroupService";
import { CreateAnswerParams } from "../services/AnswerService";
import { QuestionStudent } from "../models/QuestionStudent";
import { CreateQuestionStudentParams } from "../services/QuestionStudentService";
import { CreateProfileUserParams } from "../services/ProfileUserService";
import { PerfilUsuario } from "../models/ProfileUser";

export interface QuestionsGroupRepository {
  createQuestionsGroup(params: CreateQuestionsGroupParams): Promise<QuestionsGroup>;
  fetchAllQuestionsGroups(): Promise<QuestionsGroup[]>;
}

export interface QuestionRepository {
  createQuestion(params: CreateQuestionParams): Promise<Question>;
  findByQuestionsGroup(grupo: Partial<QuestionsGroup>): Promise<Question[]>;
}

export interface AnswerRepository {
  createAnswer(params: CreateAnswerParams): Promise<QuestionAnswer>;
  findByQuestionId(questionId: number): Promise<QuestionAnswer[]>;
}

export interface QuestionStudentRepository {
  createQuestionStudent(params: CreateQuestionStudentParams): Promise<QuestionStudent>;
  findByPerfilUsuarioId(perfilUsuarioId: number): Promise<QuestionStudent[]>;
}

export interface ProfileUserRepository {
  createProfileUser(params: CreateProfileUserParams): Promise<PerfilUsuario>;
  findByUserId(userId: number): Promise<PerfilUsuario | undefined>;
}

