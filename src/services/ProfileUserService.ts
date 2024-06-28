import { ProfileUserRepository } from "../interfaces/DatabaseInterfaces";
import { PerfilUsuario } from "../models/ProfileUser";


export interface CreateProfileUserParams {
    id: number;
    userId: number;
  }

const createProfileUser = async (repository: ProfileUserRepository, params: CreateProfileUserParams): Promise<PerfilUsuario> => {
  return await repository.createProfileUser(params);
};

const findProfileUserByUserId = async (repository: ProfileUserRepository, userId: number): Promise<PerfilUsuario | undefined> => {
  return await repository.findByUserId(userId);
};

export default { 
    createProfileUser, findProfileUserByUserId 
};