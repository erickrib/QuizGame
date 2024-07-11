import { QuestionsGroup } from "../models/QuestionsGroup";
import { IQuestionsGroupRepository } from "../interfaces/DBInterfaces";
import { CreateQuestionParams } from "./QuestionService";

export interface CreateQuestionsGroupParams extends Pick<QuestionsGroup, "nome"> {
  id: number;
  nome: string;
  questions?: CreateQuestionParams[];
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

  async update(params: CreateQuestionsGroupParams): Promise<QuestionsGroup> {
    return await this.repository.updateQuestionsGroup(params);
  }

}

