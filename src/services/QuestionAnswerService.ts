import { IQuestionAnswerRepository } from "../interfaces/DBInterfaces";
import { QuestionAnswer } from "../models/QuestionAnswer";

export interface CreateAnswerParams {
  resposta_1?: string;
  resposta_2?: string;
  resposta_3?: string;
  resposta_4?: string;
  resposta_correta?: string;
  active: boolean;
}

export class QuestionAnswerService {
  private repository: IQuestionAnswerRepository;

  constructor(repository: IQuestionAnswerRepository) {
    this.repository = repository;
  }

  async findAnswersByQuestion(questionId: number): Promise<QuestionAnswer[]> {
    return await this.repository.findByQuestionId(questionId);
  }
}

