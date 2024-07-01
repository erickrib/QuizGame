import { QuestionsGroup } from "../models/QuestionsGroup";
import { IQuestionsGroupRepository } from "../interfaces/DBInterfaces";
import { CreateAnswerParams } from "./QuestionAnswerService";

export interface CreateQuestionsGroupParams extends Pick<QuestionsGroup, "nome"> {
  questions?: {
    nome: string;
    descricao: string;
    respostas?: CreateAnswerParams;
  }[];
}

export class QuestionsGroupService {
  private repository: IQuestionsGroupRepository;

  constructor(repository: IQuestionsGroupRepository) {
    this.repository = repository;
  }

  async create(param: CreateQuestionsGroupParams): Promise<QuestionsGroup> {
    return await this.repository.createQuestionsGroup(param);
  }

  async fetchAll(): Promise<QuestionsGroup[]> {
    return await this.repository.fetchAllQuestionsGroups();
  }
}

