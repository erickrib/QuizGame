import { QuestionsGroup } from "../models/QuestionsGroup";
import { QuestionsGroupRepository } from "../interfaces/DatabaseInterfaces";
import { CreateAnswerParams } from "../services/AnswerService";

export interface CreateQuestionsGroupParams extends Pick<QuestionsGroup, "nome"> {
  questions?: {
      nome: string;
      descricao: string;
      respostas?: CreateAnswerParams;
  }[];
}
  
async function create(repository: QuestionsGroupRepository, param: CreateQuestionsGroupParams) {
  return await repository.createQuestionsGroup(param);
}

async function fetchAll(repository: QuestionsGroupRepository) {
  return await repository.fetchAllQuestionsGroups();
}

export default {
  create,
  fetchAll,
};