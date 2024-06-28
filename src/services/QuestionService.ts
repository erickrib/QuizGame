import { Question } from "../models/Question";
import { QuestionsGroup } from "../models/QuestionsGroup";
import { QuestionRepository } from "../interfaces/DatabaseInterfaces";

export type CreateQuestionParams = {
  nome: string;
  descricao: string;
  grupo_id: number;
  resposta: {};
};

export async function create(repository: QuestionRepository, params: CreateQuestionParams): Promise<Question> {
  return await repository.createQuestion(params)
}

export async function findByQuestionsGroup(repository: QuestionRepository, grupo: Partial<QuestionsGroup>) {
  return await repository.findByQuestionsGroup(grupo)
}

