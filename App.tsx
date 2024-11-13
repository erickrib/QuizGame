import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { questionsGroupService, questionsService } from './src/services';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SyncProvider } from './src/context/SyncContext';
import { useDatabaseInitialize } from './src/hooks/useDatabaseInitialize';
import HomeView from './src/pages/HomeView';
import ChoseGroupQuestions from './src/pages/ChooseGroupQuestions';
import GameView from './src/pages/GameView';
import LoginView from './src/pages/LoginView';
import SettingsView from './src/pages/SettingsView';

const Stack = createNativeStackNavigator();

export default function App() {
  const { ready } = useDatabaseInitialize();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await questionsService.fetchAll();
        console.warn('Questões:', questions.length);
      } catch (error) {
        console.error('Erro ao buscar questões:', error);
      }
    };
  
    const deleteQuestions = async () => {
      try {
        await questionsService.clearDatabase();
        console.warn('Questões deletadas.');
      } catch (error) {
        console.error('Erro ao deletar questões:', error);
      }
    };
  
    if (ready) {
    // deleteQuestions();
    fetchQuestions();
    }
  }, [ready]);
  

  if (!ready) {
    return null;
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <SyncProvider>
          <Stack.Navigator initialRouteName="HomeView">
            <Stack.Screen name="HomeView" component={HomeView} options={{ headerShown: false, title: 'Home' }} />
            <Stack.Screen name="ChoseGroupQuestions" component={ChoseGroupQuestions} options={{ title: 'Escolha Grupo' }} />
            <Stack.Screen name='UserView' component={LoginView} options={{ title: 'Login' }} />
            <Stack.Screen name="GameView" component={GameView} options={{ title: 'Quiz' }} />
            <Stack.Screen name='SettingsView' component={SettingsView} options={{ title: 'Ajustes' }} />
          </Stack.Navigator>
        </SyncProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
