import { IProfileUserRepository } from "../interfaces/DBInterfaces";
import { PerfilUsuario } from "../models/ProfileUser";


export interface CreateProfileUserParams {
  nome: string;
}

export class ProfileUserService {
  private repository: IProfileUserRepository;

  constructor(repository: IProfileUserRepository) {
    this.repository = repository;
  }

  async create(params: CreateProfileUserParams): Promise<PerfilUsuario> {
    return await this.repository.createProfileUser(params);
  }

  async fetchAll(): Promise<PerfilUsuario[]> {
    return await this.repository.fetchAllProfileUser();
  }
}