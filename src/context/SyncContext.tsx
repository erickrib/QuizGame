import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api/api';
import { transformActivities } from '../utils/transformQuestions';

interface SyncContextData {
  syncData: () => Promise<void>;
  isSyncing: boolean;
}

const SyncContext = createContext<SyncContextData>({} as SyncContextData);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      syncData();
    }
  }, [user, token]);

  const syncData = async () => {
    setIsSyncing(true);
    try {
      const activitiesList =  await api.get(`/atividade/findbyusuario/${user.id}`,  {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }); 

      if (activitiesList.data.listaAtividades) {
        await transformActivities(activitiesList.data.listaAtividades);
      }  

    } catch (error) {
      console.error('Erro ao sincronizar dados:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SyncContext.Provider value={{ syncData, isSyncing }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => useContext(SyncContext);
