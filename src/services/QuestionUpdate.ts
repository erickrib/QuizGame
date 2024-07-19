import { IQuestionUpdateRepository } from "../interfaces/DBInterfaces";

export interface CreateQuestionUpdateParams {
  lastUpdate: Date;
}

export class QuestionUpdateService {
  private repository: IQuestionUpdateRepository;

  constructor(repository: IQuestionUpdateRepository) {
    this.repository = repository;
  }

  async getLastUpdate(): Promise<Date | null> {
    return await this.repository.getLastUpdate();
  }

  async setLastUpdate(date: Date): Promise<void> {
    return await this.repository.setLastUpdate(date);
  }
}
