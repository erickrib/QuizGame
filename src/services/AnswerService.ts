import { AnswerRepository } from "../interfaces/DatabaseInterfaces";
import { QuestionAnswer } from "../models/QuestionAnswer";

export interface CreateAnswerParams {
    resposta_1?: string;
    resposta_2?: string;
    resposta_3?: string;
    resposta_4?: string;
    resposta_correta?: string;
    active: boolean;
    question_id: number;
}

async function createAnswer( repository: AnswerRepository, params: CreateAnswerParams): Promise<QuestionAnswer> {
  return await repository.createAnswer(params);
};

async function findAnswersByQuestion(repository: AnswerRepository, questionId: number): Promise<QuestionAnswer[]> {
  return await repository.findByQuestionId(questionId);
}

export default {
  createAnswer,
  findAnswersByQuestion,
};