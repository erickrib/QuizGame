import * as SQLite from 'expo-sqlite/legacy';
import { DataSource, DataSourceOptions } from "typeorm";
import { entities } from "../models";

export const config: DataSourceOptions = {
  database: "quiz.db",
  type: "expo",
  driver: SQLite,
  entities: entities,
  logging: true,
  synchronize: true,
};

export const conn = new DataSource(config);


// const configTest: DataSourceOptions = {
//   database: ":memory:",
//   type: "sqlite",
//   entities: entities,
//   synchronize: true,
//   // logging: true,
// };

// const configFinal = process.env.NODE_ENV == "test" ? configTest : config;