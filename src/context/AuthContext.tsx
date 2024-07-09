import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  { jwtDecode } from 'jwt-decode';
import { loginApi } from '../api/api';
import { profileUserService } from '../services';
import { CreateUserParams } from '../services/ProfileUserService';

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

  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            await AsyncStorage.removeItem('userToken');
            signOut();  
          } else {
            setToken(storedToken);
          }
        }
      } catch (err) {
        console.error('Falha ao carregar token do AsyncStorage:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStoredToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await loginApi.post('/login', { email, password });
      const { user: userData, token } = response.data as { user: User, token: string };
      setToken(token);

      await AsyncStorage.setItem('userToken', token);
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
      });

      setUser(userSqlite);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
