import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  { jwtDecode } from 'jwt-decode';
import { api } from '../api/api';
import { profileUserService } from '../services';
import { CreateUserParams } from '../services/ProfileUserService';
import { useDatabaseInitialize } from '../hooks/use-database-initialize';

interface User {
  id: string;
  name: string;
  email: string;
  profileId: string;
  companyId: string;
  accountActive: string;
}

interface AuthContextData {
  user: CreateUserParams | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  signIn(email: string, password: string): Promise<boolean>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CreateUserParams | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { user: userData, token } = response.data as { user: User, token: string };

      setToken(token);

      await updateLocalUser(userData);

      setError(null);
      
      return true;
    } catch (err) {
      setError('Login falhou. Por favor, verifique suas credenciais.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    setError(null);
    await AsyncStorage.removeItem('userToken');
    await profileUserService.updateLoggedInStatus(user?.id, false);
  };

  const updateLocalUser = async (userData: User) => {
    const localUser = await profileUserService.findById(parseInt(userData.id, 10));

    if (localUser) {
      // Atualize as informações do usuário local
     const userSqlite = await profileUserService.update({
        id: parseInt(userData.id),
        nome: userData.name,
        email: userData.email,
        profileId: userData.profileId,
        companyId: userData.companyId,
        accountActive: userData.accountActive,
        isLoggedIn: true,
        token: token,
      });

      setUser(userSqlite);

    } else {
      // Crie o usuário localmente
      const userSqlite = await profileUserService.create({
        id: parseInt(userData.id),
        nome: userData.name,
        email: userData.email,
        profileId: userData.profileId,
        companyId: userData.companyId,
        accountActive: userData.accountActive,
        isLoggedIn: true,
        token: token,
      });

      setUser(userSqlite);
    }
  };

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await profileUserService.fetchAll()[0];
        if (storedUser && storedUser.token) {
          const decodedToken = jwtDecode(storedUser.token) as { exp: number };
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            await profileUserService.updateLoggedInStatus(storedUser.id.toString(), false);
            signOut();
          } else {
            setUser(storedUser);
            setToken(storedUser.token);
          }
        }

      } catch (err) {
        console.error('Falha ao carregar usuário do banco de dados local:', err);
      } finally {
        setLoading(false);
      }
    };    

    loadStoredUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
