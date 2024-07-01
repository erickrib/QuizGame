import { IQuestionStudentRepository } from "../interfaces/DBInterfaces";
import { QuestionStudent } from "../models/QuestionStudent";

export interface CreateQuestionStudentParams {
    id_perfil_usuario: number;
    id_atividade: number;
    status_resposta?: string;
    active?: boolean;
    codigoAtividade?: string;
  }

  export class QuestionStudentService {
    private repository: IQuestionStudentRepository;
  
    constructor(repository: IQuestionStudentRepository) {
      this.repository = repository;
    }
  
    async create(params: CreateQuestionStudentParams): Promise<QuestionStudent> {
      return await this.repository.createQuestionStudent(params);
    }

    async fetchAll(): Promise<QuestionStudent[]> {
        return await this.repository.fetchAllQuestionStudent()
  }
}


