import { QuestionStudentRepository } from "../interfaces/DatabaseInterfaces";
import { QuestionStudent } from "../models/QuestionStudent";

export interface CreateQuestionStudentParams {
    perfilUsuarioId: number;
    atividadeId: number;
    statusResposta?: string;
    active?: boolean;
    codigoAtividade?: string;
  }

async function createQuestionStudent( repository: QuestionStudentRepository, params: CreateQuestionStudentParams): Promise<QuestionStudent> {
    return await repository.createQuestionStudent(params);
}

async function findQuestionStudentByPerfilUsuarioId(
    repository: QuestionStudentRepository,
    perfilUsuarioId: number
): Promise<QuestionStudent[]> {
    return await repository.findByPerfilUsuarioId(perfilUsuarioId);
}

export default {
    createQuestionStudent,
    findQuestionStudentByPerfilUsuarioId,
};