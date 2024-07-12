import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  { jwtDecode } from 'jwt-decode';
import { api } from '../api/api';
import { profileUserService } from '../services';
import { CreateUserParams } from '../services/ProfileUserService';
import { useDatabaseInitialize } from '../hooks/use-database-initialize';
import { Text } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  profileId: string;
  companyId: string;
  accountActive: string;
  isLoggedIn?: boolean;
  token?: string;
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

  const { ready } = useDatabaseInitialize();

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { user: userData, token } = response.data as { user: User, token: string};

      userData.isLoggedIn = true;
      userData.token = token;

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

    const userSqlite = {
      id: parseInt(userData.id, 10),
      nome: userData.name,
      email: userData.email,
      profileId: userData.profileId,
      companyId: userData.companyId,
      accountActive: userData.accountActive,
      isLoggedIn: true,
      token: userData.token,
    };

    if (localUser) {
      // Atualize as informações do usuário local
      await profileUserService.update(userSqlite);
    } else {
      // Crie o usuário localmente
      await profileUserService.create(userSqlite);
    }

      setUser(userSqlite);
  };

  useEffect(() => {
    const loadStoredUser = async () => {
      try {        
        const storedUser = await profileUserService.fetchAll();
        const loggedUser = storedUser.find(usuario => usuario.isLoggedIn === true);

        console.log('Usuário logado encontrado:', storedUser);
        
        if (loggedUser) {
          const decodedToken = jwtDecode(loggedUser.token) as { exp: number };
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            await profileUserService.updateLoggedInStatus(loggedUser.id, false);
            signOut();
          } else {
            setUser(loggedUser);
            setToken(loggedUser.token);
          }
        }

      } catch (err) {
        console.error('Falha ao carregar usuário do banco de dados local:', err);
      } finally {
        setLoading(false);
      }
    };    

    
    if (ready) {
      loadStoredUser();
    }
  }, [ready]);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
