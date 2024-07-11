import { DataSource, EntityManager } from "typeorm";
import { QuestionsGroup } from "../models/QuestionsGroup";
import { Question } from "../models/Question";
import { CreateQuestionsGroupParams } from "../services/QuestionsGroupService";
import { CreateQuestionParams } from "../services/QuestionService";
import { IQuestionsGroupRepository, IQuestionRepository, IQuestionAnswerRepository, IProfileUserRepository, IQuestionStudentRepository } from "../interfaces/DBInterfaces";

import { conn } from "./db";
import { CreateAnswerParams } from "../services/QuestionAnswerService";
import { QuestionAnswer } from "../models/QuestionAnswer";
import { User } from "../models/User";
import { CreateUserParams } from "../services/ProfileUserService";
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
    group.id = param.id;
    group.nome = param.nome;
    
    return await trans.save(group);
  }
  
  // Funções de Criação de Perguntas
  private async createQuestions(trans: EntityManager, questions: CreateQuestionsGroupParams['questions'], groupDB: QuestionsGroup): Promise<Question[]> {
    const questionsPromises = questions.map(async ({ id, nome, descricao, resposta, idioma, codigo, tipo }) => {
      const question = new Question();
      question.id = id
      question.nome = nome;
      question.descricao = descricao;
      question.grupo = groupDB;
      question.idioma = idioma;
      question.codigo = codigo;
      question.tipo = tipo;
  
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
    answer.questao = questionDB;
  
    await trans.save(answer);
  }
  
  // Funções de Atualização de Grupo de Questões
  async updateQuestionsGroup(param: CreateQuestionsGroupParams): Promise<QuestionsGroup | undefined> {
    return await this.conn.transaction(async (trans) => {
        const groupDB = await trans.findOne(QuestionsGroup, { where: { id: param.id } });
        if (!groupDB) {
            return undefined; 
        }
  
        if (param.nome) {
            groupDB.nome = param.nome;
        }
  
        if (param.questions) {
            await this.updateQuestions(trans, param.questions);
        }
  
        await trans.save(groupDB);
  
        return groupDB;
    });
  }
  
  // Função de Atualização de Perguntas
  private async updateQuestions(trans: EntityManager, questions: CreateQuestionParams[]): Promise<void> {
    const questionsPromises = questions.map(async ({ id, nome, descricao, resposta }) => {
        const questionDB = await trans.findOne(Question, { where: { id } });
        if (!questionDB) {
            return; 
        }
  
        if (nome) {
            questionDB.nome = nome;
        }

        if (descricao) {
            questionDB.descricao = descricao;
        }
  
        if (resposta) {
            await this.updateAnswer(trans, resposta, questionDB);
        }
  
        await trans.save(questionDB);
    });
  
    await Promise.all(questionsPromises);
  }
  
  // Função de Atualização de Resposta
  private async updateAnswer(trans: EntityManager, resposta: CreateAnswerParams, questionDB: Question): Promise<void> {
    const answerDB = await trans.findOne(QuestionAnswer, { where: { questao: questionDB } });
    
    if (!answerDB) {
        return; 
    }
  
    if (resposta.resposta_1) {
        answerDB.resposta_1 = resposta.resposta_1;
    }

    if (resposta.resposta_2) {
        answerDB.resposta_2 = resposta.resposta_2;
    }
    if (resposta.resposta_3) {
        answerDB.resposta_3 = resposta.resposta_3;
    }
    if (resposta.resposta_4) {
        answerDB.resposta_4 = resposta.resposta_4;
    }

    if (resposta.resposta_correta) {
        answerDB.resposta_correta = resposta.resposta_correta;
    }
  
    await trans.save(answerDB);
  }
  
  
  // Funções de Usuário 
  async createProfileUser(params: CreateUserParams): Promise<User> {
    return await this.conn.transaction(async (trans) => {
      const perfilUsuario = new User();
      perfilUsuario.id = params.id;
      perfilUsuario.nome = params.nome;
      perfilUsuario.email = params.email;
      perfilUsuario.profileId = params.profileId;
      perfilUsuario.companyId = params.companyId;
      perfilUsuario.accountActive = params.accountActive;
      perfilUsuario.isLoggedIn = true;
      perfilUsuario.token = params.token

      await trans.save(perfilUsuario);

      return await trans.save(perfilUsuario);
    });
  }

  async fetchAllUser(): Promise<User[]> {
    return await this.conn.manager.find(User);
  }

  async updateProfileUser(params: CreateUserParams): Promise<User> {
    return await this.conn.transaction(async (trans) => {
      try {
        const existingUser = await trans.findOneOrFail(User, { where: { id: params.id } });
        existingUser.nome = params.nome;
        existingUser.email = params.email;
        existingUser.profileId = params.profileId;
        existingUser.companyId = params.companyId;
        existingUser.accountActive = params.accountActive;
  
        const updatedUser = await trans.save(existingUser);
        return updatedUser;
      } catch (error) {
        console.error('Erro ao atualizar perfil de usuário:', error);
        throw new Error('Erro ao atualizar perfil de usuário');
      }
    });
  }

  async updateLoggedInStatus(id: number, status: boolean): Promise<User> {
    return await this.conn.transaction(async (transManager: EntityManager) => {
      try {
        const existingUser = await transManager.findOne(User, { where: { id } });

        if (!existingUser) {
          throw new Error(`Usuário com ID ${id} não encontrado.`);
        }

        existingUser.isLoggedIn = status;

        await transManager.save(existingUser);

        return existingUser;
        
      } catch (error) {
        throw new Error(`Falha ao atualizar o estado de isLoggedIn para o usuário com ID ${id}: ${error.message}`);
      }
    });
  }

  async updateQuestionById(id: number, params: CreateQuestionParams): Promise<Question> {
    return await this.conn.transaction(async (trans) => {
      try {
        const existingQuestion = await trans.findOneOrFail(Question, { where: { id } });
        existingQuestion.nome = params.nome;
        existingQuestion.descricao = params.descricao;
        existingQuestion.grupo = await trans.findOneOrFail(QuestionsGroup, { where: { id: params.grupo_id } });
        existingQuestion.resposta = await trans.findOneOrFail(QuestionAnswer, { where: { id: params.resposta.id } });
  
        const updatedQuestion = await trans.save(existingQuestion);
        return updatedQuestion;
      } catch (error) {
        console.error('Erro ao atualizar questão:', error);
        throw new Error('Erro ao atualizar questão');
      }
    });
  };  

  async findProfileUserById(userId: number): Promise<User | undefined> {
    return await this.conn.manager.findOne(User, { where: { id: userId } });
  }
  
  async createQuestionStudent(params: CreateQuestionStudentParams): Promise<QuestionStudent> {
    return await this.conn.transaction(async (trans) => {
      try {
        console.log('Iniciando transação para criar QuestionStudent');

        // Encontre o perfil de usuário associado
        const perfilUsuario = await trans.findOneOrFail(User, { where: { id: params.id_perfil_usuario } });
        console.log('PerfilUsuario encontrado:', perfilUsuario);

        // Encontra a questão associada
        const question = await trans.findOneOrFail(Question, { where: { id: params.id_atividade } });
        console.log('Question encontrada:', question);

        // Crie o objeto QuestionStudent
        const questionStudent = new QuestionStudent();
        questionStudent.perfilUsuario = perfilUsuario;
        questionStudent.questao = question;
        questionStudent.statusResposta = params.status_resposta;
        questionStudent.codigoAtividade = params.codigo_atividade;
        questionStudent.tempo_execucao = params.tempo_execucao;
        questionStudent.isPendingSync = params.is_pending_sync;

        console.warn('QuestionStudent criado:', questionStudent);

        const savedQuestionStudent = await trans.save(questionStudent);
        return savedQuestionStudent;
      } catch (error) {
        console.error('Erro ao criar QuestionStudent:', error);
        throw new Error('Erro ao criar QuestionStudent');
      }
    });
  }

  async fetchAllQuestions(): Promise<Question[]> {
    return await this.conn.manager.find(Question, {
      relations: ['grupo', 'resposta'] 
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

  async findPendingSyncAnswers(): Promise<QuestionStudent[]> {
    return await conn.manager.find(QuestionStudent, {
      where: {
          isPendingSync: true,
      },
      relations: ['perfilUsuario', 'questao'] 
  });
  }

  async markAsSynced(questionStudents: QuestionStudent[]): Promise<void> {
    await this.conn.transaction(async (transManager) => {
      try {
        for (const student of questionStudents) {
          const existingStudent = await transManager.findOneOrFail(QuestionStudent, { where: { id: student.id } });
          existingStudent.isPendingSync = false;
          await transManager.save(existingStudent);
        }
      } catch (error) {
        console.error('Erro ao marcar como sincronizado:', error);
        throw new Error('Erro ao marcar como sincronizado');
      }
    });
  }
  
  async findByQuestionId(questionId: number): Promise<QuestionAnswer[]> {
    return await this.conn.manager.find(QuestionAnswer, {
      where: {
        questao: { id: questionId },
      },
    });
  }

  async deleteQuestionById(id: number): Promise<void> {
    await this.conn.manager.delete(Question, { id });
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

      await trans.delete(User, {});
  });

    console.warn('Banco de dados limpo!');
  }
}

export const sqliteService = SQLiteDatabase.getInstance();
