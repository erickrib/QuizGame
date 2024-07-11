import { Question } from "../models/Question";
import { QuestionsGroup } from "../models/QuestionsGroup";
import { IQuestionRepository } from "../interfaces/DBInterfaces";
import { CreateAnswerParams } from "./QuestionAnswerService";

export type CreateQuestionParams = {
  id: number;
  nome: string;
  descricao: string;
  grupo_id: number;
  resposta: CreateAnswerParams;
  codigo: string;
  idioma: string;
  tipo: string;
};

export class QuestionsService {
  private repository: IQuestionRepository;

  constructor(repository: IQuestionRepository) {
    this.repository = repository;
  }

  async clearDatabase(): Promise<void> {
    return await this.repository.clearDatabase();
  }

  async findByQuestionsGroup(grupo: Partial<QuestionsGroup>): Promise<Question[]> {
    return await this.repository.findByQuestionsGroup(grupo);
  }

  async fetchAll(): Promise<Question[]> {  
    return await this.repository.fetchAllQuestions();
  }

  async delete(id: number): Promise<void> {
    return await this.repository.deleteQuestionById(id);
  }
}
