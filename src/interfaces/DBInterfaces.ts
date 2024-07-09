import { QuestionsGroup } from "../models/QuestionsGroup";
import { Question } from "../models/Question";
import { QuestionAnswer } from "../models/QuestionAnswer";

import { CreateQuestionParams } from "../services/QuestionService";
import { CreateQuestionsGroupParams } from "../services/QuestionsGroupService";
import { CreateAnswerParams } from "../services/QuestionAnswerService";
import { QuestionStudent } from "../models/QuestionStudent";
import { CreateQuestionStudentParams } from "../services/QuestionStudentService";
import { CreateUserParams } from "../services/ProfileUserService";
import { User } from "../models/User";

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
  createProfileUser(params: CreateUserParams): Promise<User>;
  fetchAllUser(): Promise<User[]>
  updateProfileUser(params: CreateUserParams): Promise<User>;
  findProfileUserById(id: number): Promise<User | null>;
}

