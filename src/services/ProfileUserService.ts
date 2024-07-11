import { IProfileUserRepository } from "../interfaces/DBInterfaces";
import { User } from "../models/User";

export interface CreateUserParams {
  id: number;
  nome: string;
  email: string;
  profileId: string;
  companyId: string;
  accountActive: string;
  isLoggedIn: boolean;
  token?: string;
}

export class ProfileUserService {
  private repository: IProfileUserRepository;

  constructor(repository: IProfileUserRepository) {
    this.repository = repository;
  }

  async create(params: CreateUserParams): Promise<User> {
    return await this.repository.createProfileUser(params);
  }

  async fetchAll(): Promise<User[]> {
    return await this.repository.fetchAllUser();
  }

  async findById(id: number): Promise<User | null> {
    return await this.repository.findProfileUserById(id);
  }

  async update(params: CreateUserParams): Promise<User> {
    return await this.repository.updateProfileUser(params);
  }

  async updateLoggedInStatus(id: number, status: boolean): Promise<User> {
    return await this.repository.updateLoggedInStatus(id, status);
  }
}

