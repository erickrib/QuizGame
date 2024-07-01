import { DataSource, EntityManager } from "typeorm";
import { QuestionsGroup } from "../models/QuestionsGroup";
import { Question } from "../models/Question";
import { CreateQuestionsGroupParams } from "../services/QuestionsGroupService";
import { CreateQuestionParams } from "../services/QuestionService";
import { IQuestionsGroupRepository, IQuestionRepository, IQuestionAnswerRepository } from "../interfaces/DBInterfaces";

import { conn } from "./db";
import { CreateAnswerParams } from "../services/QuestionAnswerService";
import { QuestionAnswer } from "../models/QuestionAnswer";

class SQLiteDatabase implements IQuestionsGroupRepository, IQuestionRepository, IQuestionAnswerRepository {
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

  // Funções de Criação de Grupo de Questões
  async createQuestionsGroup(param: CreateQuestionsGroupParams): Promise<QuestionsGroup> {
    return await this.conn.transaction(async (trans) => {
      // 1. Criar o grupo de questões
      const groupDB = await this.createGroup(trans, param);
  
      // 2. Criar as questões associadas, se houver
      if (param.questions) {
        const questionsDB = await this.createQuestions(trans, param.questions, groupDB);
        groupDB.questions = questionsDB;
      }
  
      return groupDB;
    });
  }
  
  private async createGroup(trans: EntityManager, param: CreateQuestionsGroupParams): Promise<QuestionsGroup> {
    const group = new QuestionsGroup();
    group.nome = param.nome;
    
    return await trans.save(group);
  }
  
  private async createQuestions(trans: EntityManager, questions: CreateQuestionsGroupParams['questions'], groupDB: QuestionsGroup): Promise<Question[]> {
    const questionsPromises = questions.map(async ({ nome, descricao, respostas }) => {
      const question = new Question();
      question.nome = nome;
      question.descricao = descricao;
      question.grupo = groupDB;
  
      const questionDB = await trans.save(question);
  
      if (respostas) {
        await this.createAnswers(trans, respostas, questionDB);
      }
  
      return questionDB;
    });
  
    return await Promise.all(questionsPromises);
  }
  
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
      await trans.delete(Question, {});
      await trans.delete(QuestionsGroup, {});
    });

    console.log('Banco de dados limpo!');
  }
}

export const sqliteService = SQLiteDatabase.getInstance();
