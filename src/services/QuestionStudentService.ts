import { IQuestionStudentRepository } from "../interfaces/DBInterfaces";
import { QuestionStudent } from "../models/QuestionStudent";

export interface CreateQuestionStudentParams {
  id_perfil_usuario: number;
  id_atividade: number;
  status_resposta?: string;
  codigo_atividade?: string;
  tempo_execucao?: number;
  is_pending_sync: boolean;
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

  async findPendingSyncAnswers(): Promise<QuestionStudent[]> {
    return await this.repository.findPendingSyncAnswers();
  }

  async markAsSynced(questionsStudent: QuestionStudent[]) {
    return await this.repository.markAsSynced(questionsStudent);
  }

}

