import * as SQLite from 'expo-sqlite/legacy';
import { DataSource, DataSourceOptions } from "typeorm";
import { entities } from "../models";

export const config: DataSourceOptions = {
  database: "quiz.db", // Define o nome do banco de dados como "quiz.db"
  type: "expo", // Define o tipo de conexão como "expo"
  driver: SQLite, // Define o driver SQLite do Expo como o driver para conexão
  entities: entities, // Define as entidades do TypeORM
  logging: true, // Logging para registrar mensagens relacionadas às operações de banco de dados
  synchronize: true, // Sincroniza automaticamente as entidades com o banco de dados
};

// Cria uma nova instância de DataSource usando a configuração definida acima
export const conn = new DataSource(config);

export const initializeDatabase = async () => {
  try {
    if (!conn.isInitialized) {
      await conn.initialize();
      console.warn ('Banco de dados conectado!');
    }
    return true;
  } catch (error) {
    console.error('Erro ao inicializar o Banco de dados:', error);
    return false;
  }
};
