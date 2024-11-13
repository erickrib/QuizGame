import { QuestionsGroup } from "../models/QuestionsGroup";
import { Question } from "../models/Question";
import { QuestionAnswer } from "../models/QuestionAnswer";

import { CreateQuestionsGroupParams } from "../services/QuestionsGroupService";
import { QuestionStudent } from "../models/QuestionStudent";
import { CreateQuestionStudentParams } from "../services/QuestionStudentService";
import { CreateUserParams } from "../services/ProfileUserService";
import { User } from "../models/User";
import { Language } from "../hooks/useLanguage";

export interface IQuestionsGroupRepository {
  createQuestionsGroup(params: CreateQuestionsGroupParams): Promise<QuestionsGroup>;
  fetchAllQuestionsGroups(language: Language): Promise<QuestionsGroup[]>
  updateQuestionsGroup(params: CreateQuestionsGroupParams): Promise<QuestionsGroup>;
}

export interface IQuestionRepository {
  clearDatabase(): Promise<void>;
  findByQuestionsGroup(grupo: Partial<QuestionsGroup>): Promise<Question[]>;
  fetchAllQuestions(): Promise<Question[]>;
  deleteQuestionById(id: number): Promise<void>;
}

export interface IQuestionAnswerRepository {
  findByQuestionId(questionId: number): Promise<QuestionAnswer[]>;
}

export interface IQuestionStudentRepository {
  createQuestionStudent(params: CreateQuestionStudentParams): Promise<QuestionStudent>;
  fetchAllQuestionStudent(): Promise<QuestionStudent[]>;
  findPendingSyncAnswers(): Promise<QuestionStudent[]>;
  markAsSynced(questionsStudent: QuestionStudent[]): Promise<void>;
  deleteQuestionStudentById(id: number): Promise<void>;
  updateQuestionStudent(params: CreateQuestionStudentParams): Promise<QuestionStudent>;
}

export interface IQuestionUpdateRepository {
  getLastUpdate(): Promise<Date | null>
  setLastUpdate(date: Date): Promise<void>
}

export interface IProfileUserRepository {
  createProfileUser(params: CreateUserParams): Promise<User>;
  fetchAllUser(): Promise<User[]>
  updateProfileUser(params: CreateUserParams): Promise<User>;
  findProfileUserById(id: number): Promise<User | null>;
  updateLoggedInStatus(id: number, status: boolean): Promise<User>;
}

