import { DataSource, EntityManager } from "typeorm";
import { QuestionsGroup } from "../models/QuestionsGroup";
import { Question } from "../models/Question";
import { CreateQuestionsGroupParams } from "../services/QuestionsGroupService";
import { CreateQuestionParams } from "../services/QuestionService";
import { QuestionsGroupRepository, QuestionRepository, AnswerRepository } from "../interfaces/DatabaseInterfaces";

import { conn } from "./db";
import { CreateAnswerParams } from "../services/AnswerService";
import { QuestionAnswer } from "../models/QuestionAnswer";

class SQLiteDatabaseService implements QuestionsGroupRepository, QuestionRepository, AnswerRepository {
  private conn: DataSource;

  constructor() {
    this.conn = conn;
  }

  async initialize(): Promise<void> {
    if (!this.conn.isInitialized) {
      await this.conn.initialize();
    }
  }

    // Implementações de QuestionsGroup
    async createQuestionsGroup(param: CreateQuestionsGroupParams): Promise<QuestionsGroup> {
      return await this.conn.transaction(async (trans) => {
        const group = new QuestionsGroup();
        group.nome = param.nome;
    
        const groupDB = await trans.save(group);
    
        if (param.questions) {
          const questionsPromises = param.questions.map(async ({ nome, descricao, respostas }) => {
            const question = new Question();
            question.nome = nome;
            question.descricao = descricao;
            question.grupo = groupDB;
    
            const questionDB = await trans.save(question);
    
            if (respostas) {
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
    
            return questionDB;
          });
    
          const questionsDB = await Promise.all(questionsPromises);
          groupDB.questions = questionsDB;
        }
    
        return groupDB;
      });
    }
    

  async fetchAllQuestionsGroups(): Promise<QuestionsGroup[]> {
    return await this.conn.manager.find(QuestionsGroup, { relations: ["questions"] });
  }

  // Implementações de Question
  async createQuestion(param: CreateQuestionParams): Promise<Question> {
    return await this.conn.transaction(async (trans) => {
      const question = new Question();
      question.descricao = param.descricao;
      question.nome = param.nome;

      question.grupo = { id: param.grupo_id } as QuestionsGroup;

      const questionDB = await trans.save(question);
      return questionDB;
    });
  }

  async findByQuestionsGroup(grupo: Partial<QuestionsGroup>): Promise<Question[]> {
    return await this.conn.manager.find(Question, {
      where: {
        grupo,
      },
    });
  }

  // Implementações de Answer
  async createAnswer(params: CreateAnswerParams): Promise<QuestionAnswer> {
    return await this.conn.transaction(async (trans) => {
      const answer = new QuestionAnswer();
      answer.resposta_1 = params.resposta_1;
      answer.resposta_2 = params.resposta_2;
      answer.resposta_3 = params.resposta_3;
      answer.resposta_4 = params.resposta_4;
      answer.resposta_correta = params.resposta_correta;
      answer.active = params.active;
      answer.questao = { id: params.question_id } as Question;

      const answerDB = await trans.save(answer);
      return answerDB;
    });
  }

  async findByQuestionId(questionId: number): Promise<QuestionAnswer[]> {
    return await this.conn.manager.find(QuestionAnswer, {
      where: {
        questao: { id: questionId },
      },
    });
  }
}

export const sqliteService = new SQLiteDatabaseService();
