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
    if (isConnected) {
      syncData();
      setIsSyncEnabled(true);

    } else {
        setIsSyncEnabled(false);
    }

  }, [isConnected]);

  const syncData = async () => {
    setIsSyncing(true);

    try {
        Promise.all([
            syncTransformedQuestions(),
            syncPendingAnswersUser()
        ]);

    } catch (error) {
      console.error('Erro ao sincronizar dados:', error);
      setIsSyncEnabled(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncTransformedQuestions = async () => {
    try {
      const activitiesList =  await api.get(`/atividade/offline/${user.id}/2024-07-10`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }); 

      if (activitiesList.data.listaAtividades) {
        await syncQuestions(activitiesList.data.listaAtividades);
      }
    } catch (error) {
      console.error('Erro ao sincronizar questões:', error);
    }
  };

  const syncPendingAnswersUser = async () => {
    try {
     if (isConnected) {   
      await syncPendingAnswers(token);
     }
    } catch (error) {
      console.error('Erro ao sincronizar respostas pendentes:', error);
    }
  };

  return (
    <SyncContext.Provider value={{ syncData, syncTransformedQuestions, syncPendingAnswersUser, isSyncing, isSyncEnabled }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => useContext(SyncContext);

