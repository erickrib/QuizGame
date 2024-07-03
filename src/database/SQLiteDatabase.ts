import { DataSource, EntityManager } from "typeorm";
import { QuestionsGroup } from "../models/QuestionsGroup";
import { Question } from "../models/Question";
import { CreateQuestionsGroupParams } from "../services/QuestionsGroupService";
import { CreateQuestionParams } from "../services/QuestionService";
import { IQuestionsGroupRepository, IQuestionRepository, IQuestionAnswerRepository, IProfileUserRepository, IQuestionStudentRepository } from "../interfaces/DBInterfaces";

import { conn } from "./db";
import { CreateAnswerParams } from "../services/QuestionAnswerService";
import { QuestionAnswer } from "../models/QuestionAnswer";
import { PerfilUsuario } from "../models/ProfileUser";
import { CreateProfileUserParams } from "../services/ProfileUserService";
import { QuestionStudent } from "../models/QuestionStudent";
import { CreateQuestionStudentParams } from "../services/QuestionStudentService";

class SQLiteDatabase implements IQuestionsGroupRepository, IQuestionRepository, IQuestionAnswerRepository, IProfileUserRepository, IQuestionStudentRepository {

  private static instance: SQLiteDatabase | null = null;
  private conn: DataSource;

  constructor() {
     this.conn = conn;
  }

  public static getInstance(): SQLiteDatabase {
    if (!SQLiteDatabase.instance) {
      SQLiteDatabase.instance = new SQLiteDatabase();
    }
    return SQLiteDatabase.instance;
  }

  async initialize(): Promise<void> {
    if (!this.conn.isInitialized) {
      await this.conn.initialize();
    }
  }

  // Funções de Criação Questões
  async createQuestionsGroup(param: CreateQuestionsGroupParams): Promise<QuestionsGroup> {
    return await this.conn.transaction(async (trans) => {
      // Criar o grupo de questões
      const groupDB = await this.createGroup(trans, param);
  
      // Criar as questões associadas, se houver
      if (param.questions) {
        const questionsDB = await this.createQuestions(trans, param.questions, groupDB);
        groupDB.questions = questionsDB;
      }
  
      return groupDB;
    });
  }
  
  // Funções de Criação de Grupo de Questões
  private async createGroup(trans: EntityManager, param: CreateQuestionsGroupParams): Promise<QuestionsGroup> {
    const group = new QuestionsGroup();
    group.nome = param.nome;
    
    return await trans.save(group);
  }
  
  // Funções de Criação de Perguntas
  private async createQuestions(trans: EntityManager, questions: CreateQuestionsGroupParams['questions'], groupDB: QuestionsGroup): Promise<Question[]> {
    const questionsPromises = questions.map(async ({ nome, descricao, resposta }) => {
      const question = new Question();
      question.nome = nome;
      question.descricao = descricao;
      question.grupo = groupDB;
  
      const questionDB = await trans.save(question);
  
      if (resposta) {
        await this.createAnswers(trans, resposta, questionDB);
      }
  
      return questionDB;
    });
  
    return await Promise.all(questionsPromises);
  }
  
  // Funções de Criação de Respostas
  private async createAnswers(trans: EntityManager, respostas: CreateAnswerParams, questionDB: Question): Promise<void> {
    const answer = new QuestionAnswer();
    answer.resposta_1 = respostas.resposta_1;
    answer.resposta_2 = respostas.resposta_2;
    answer.resposta_3 = respostas.resposta_3;
    answer.resposta_4 = respostas.resposta_4;
    answer.resposta_correta = respostas.resposta_correta;
    answer.active = respostas.active;
    answer.questao = questionDB;
  
    await trans.save(answer);
  }
  
  // Funções de Usuário 
  async createProfileUser(params: CreateProfileUserParams): Promise<PerfilUsuario> {
    return await this.conn.transaction(async (trans) => {
      const perfilUsuario = new PerfilUsuario();
      perfilUsuario.nome = params.nome;

      await trans.save(perfilUsuario);

      return await trans.save(perfilUsuario);
    });
  }

  async fetchAllProfileUser(): Promise<PerfilUsuario[]> {
    return await this.conn.manager.find(PerfilUsuario);
  }
  
  async createQuestionStudent(params: CreateQuestionStudentParams): Promise<QuestionStudent> {
    return await this.conn.transaction(async (trans) => {
      try {
        console.log('Iniciando transação para criar QuestionStudent');

        // Encontre o perfil de usuário associado
        const perfilUsuario = await trans.findOneOrFail(PerfilUsuario, { where: { id: params.id_perfil_usuario } });
        console.log('PerfilUsuario encontrado:', perfilUsuario);

        // Encontra a questão associada
        const question = await trans.findOneOrFail(Question, { where: { id: params.id_atividade } });
        console.log('Question encontrada:', question);

        // Crie o objeto QuestionStudent
        const questionStudent = new QuestionStudent();
        questionStudent.perfilUsuario = perfilUsuario;
        questionStudent.questao = question;
        questionStudent.statusResposta = params.status_resposta;
        questionStudent.dataResposta = new Date().toISOString();
        console.log('QuestionStudent criado:', questionStudent);

        const savedQuestionStudent = await trans.save(questionStudent);
        console.log('QuestionStudent salvo:', savedQuestionStudent);

        return savedQuestionStudent;
      } catch (error) {
        console.error('Erro ao criar QuestionStudent:', error);
        throw new Error('Erro ao criar QuestionStudent');
      }
    });
  }

  async fetchAllQuestionStudent(): Promise<QuestionStudent[]> {
    return await this.conn.manager.find(QuestionStudent);
  }
  
  // Funções de Busca de Grupo de Questões
  async fetchAllQuestionsGroups(): Promise<QuestionsGroup[]> {
    return await this.conn.manager.find(QuestionsGroup, { relations: ["questions"] });
  }

  async findByQuestionsGroup(grupo: Partial<QuestionsGroup>): Promise<Question[]> {
    return await this.conn.manager.find(Question, {
      where: {
        grupo,
      },
    });
  }

  async findByQuestionId(questionId: number): Promise<QuestionAnswer[]> {
    return await this.conn.manager.find(QuestionAnswer, {
      where: {
        questao: { id: questionId },
      },
    });
  }

  // Função para limpar todo o banco de dados
  async clearDatabase(): Promise<void> {
    console.warn('ATENÇÃO: Esta função limpará todo o banco de dados!');

    // Remove todos os registros de todas as tabelas
    await conn.transaction(async (trans) => {
      await trans.delete(QuestionAnswer, {});

      await trans.delete(QuestionStudent, {});

      await trans.delete(Question, {});

      await trans.delete(QuestionsGroup, {});

      await trans.delete(PerfilUsuario, {});
  });

    console.warn('Banco de dados limpo!');
  }
}

export const sqliteService = SQLiteDatabase.getInstance();
