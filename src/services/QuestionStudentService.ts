import { IQuestionStudentRepository } from "../interfaces/DBInterfaces";
import { QuestionStudent } from "../models/QuestionStudent";

export interface CreateQuestionStudentParams {
    perfilUsuarioId: number;
    atividadeId: number;
    statusResposta?: string;
    active?: boolean;
    codigoAtividade?: string;
  }

  export class QuestionStudentService {
    private repository: IQuestionStudentRepository;
  
    constructor(repository: IQuestionStudentRepository) {
      this.repository = repository;
    }
  
    async createQuestionStudent(params: CreateQuestionStudentParams): Promise<QuestionStudent> {
      return await this.repository.createQuestionStudent(params);
    }
  }


