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
    isLoading: boolean;
    isSyncEnabled: boolean;
}

const SyncContext = createContext<SyncContextData>({} as SyncContextData);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncEnabled, setIsSyncEnabled] = useState(true);
    const { user, token } = useAuth();
    const isConnected = useNetworkStatus();

    useEffect(() => {
        if (user?.id && token && isConnected) {
            syncData();
        } else {
            setIsSyncEnabled(true);
        }
    }, [user, token, isConnected]);

    useEffect(() => {
        return () => {
            setIsLoading(false); 
        };
    }, []);

    const syncData = async () => {
        setIsLoading(true);
      
        try {
            await Promise.all([
                syncTransformedQuestions(), 
                syncPendingAnswersUser()
            ]);
        } catch (error) {
          console.error('Erro ao sincronizar dados:', error);
      
        } finally {
          setIsLoading(false);
          setIsSyncEnabled(false);
        }
      };
      

    const syncTransformedQuestions = async () => {
        try {
            const activitiesList = await api.get(`/atividade/offline/${user.id}/2024-07-10`, {
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
        <SyncContext.Provider value={{ syncData, syncTransformedQuestions, syncPendingAnswersUser, isLoading, isSyncEnabled }}>
            {children}
        </SyncContext.Provider>
    );
};

export const useSync = () => useContext(SyncContext);

