import { QuestionsGroup } from "../models/QuestionsGroup";
import { Question } from "../models/Question";
import { QuestionAnswer } from "../models/QuestionAnswer";

import { CreateQuestionParams } from "../services/QuestionService";
import { CreateQuestionsGroupParams } from "../services/QuestionsGroupService";
import { CreateAnswerParams } from "../services/QuestionAnswerService";
import { QuestionStudent } from "../models/QuestionStudent";
import { CreateQuestionStudentParams } from "../services/QuestionStudentService";
import { CreateProfileUserParams } from "../services/ProfileUserService";
import { PerfilUsuario } from "../models/ProfileUser";

export interface IQuestionsGroupRepository {
  createQuestionsGroup(params: CreateQuestionsGroupParams): Promise<QuestionsGroup>;
  fetchAllQuestionsGroups(): Promise<QuestionsGroup[]>;
}

export interface IQuestionRepository {
  clearDatabase(): Promise<void>;
  findByQuestionsGroup(grupo: Partial<QuestionsGroup>): Promise<Question[]>;
}

export interface IQuestionAnswerRepository {
  findByQuestionId(questionId: number): Promise<QuestionAnswer[]>;
}

export interface IQuestionStudentRepository {
  createQuestionStudent(params: CreateQuestionStudentParams): Promise<QuestionStudent>;
  fetchAllQuestionStudent(): Promise<QuestionStudent[]>;
}

export interface IProfileUserRepository {
  createProfileUser(params: CreateProfileUserParams): Promise<PerfilUsuario>;
  fetchAllProfileUser(): Promise<PerfilUsuario[]>
}

