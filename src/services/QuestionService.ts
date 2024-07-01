import { Question } from "../models/Question";
import { QuestionsGroup } from "../models/QuestionsGroup";
import { IQuestionRepository } from "../interfaces/DBInterfaces";

export type CreateQuestionParams = {
  nome: string;
  descricao: string;
  grupo_id: number;
  resposta: {};
};

export class QuestionsService {
  private repository: IQuestionRepository;

  constructor(repository: IQuestionRepository) {
    this.repository = repository;
  }

  // async create(params: CreateQuestionParams): Promise<Question> {
  //   return await this.repository.createQuestion(params);
  // }

  async findByQuestionsGroup(grupo: Partial<QuestionsGroup>): Promise<Question[]> {
    return await this.repository.findByQuestionsGroup(grupo);
  }
}
