import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api/api';
import { syncQuestions } from '../utils/syncQuestions';
import { syncPendingAnswers } from '../utils/syncPendingAnswers';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface SyncContextData {
  syncData: () => Promise<void>;
  syncTransformedQuestions: () => Promise<void>;
  syncPendingAnswersUser: () => Promise<void>;
  isSyncing: boolean;
  isSyncEnabled: boolean;
}

const SyncContext = createContext<SyncContextData>({} as SyncContextData);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncEnabled, setIsSyncEnabled] = useState(true);
  const { user, token } = useAuth();
  const isConnected = useNetworkStatus();

  useEffect(() => {
    if (user && token) {
      syncData();
    }
  }, [user, token]);

  useEffect(() => {
    if (!isConnected) {
      syncData();
    }
  }, [isConnected]);

  const syncData = async () => {
    setIsSyncing(true);
    try {
      await syncTransformedQuestions();
      await syncPendingAnswersUser();

    } catch (error) {
      console.error('Erro ao sincronizar dados:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncTransformedQuestions = async () => {
    try {
      const activitiesList =  await api.get(`/atividade/findbyusuario/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }); 

      if (activitiesList.data.listaAtividades) {
        await syncQuestions(activitiesList.data.listaAtividades);
      }
    } catch (error) {
      console.error('Erro ao sincronizar questões:', error);
      setIsSyncEnabled(false);
    }
  };

  const syncPendingAnswersUser = async () => {
    try {
      await syncPendingAnswers(token);
    } catch (error) {
      console.error('Erro ao sincronizar respostas pendentes:', error);
      throw error; 
    }
  };

  return (
    <SyncContext.Provider value={{ syncData, syncTransformedQuestions, syncPendingAnswersUser, isSyncing, isSyncEnabled }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => useContext(SyncContext);

