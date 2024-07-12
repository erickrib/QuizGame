import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeView from './src/pages/HomeView';
import ChoseGroupQuestions from './src/pages/ChooseGroupQuestions';
import GameView from './src/pages/GameView';
import { useDatabaseInitialize } from './src/hooks/useDatabaseInitialize';

import { profileUserService } from './src/services';
import { useEffect } from 'react';
import { questionsService } from './src/services';
import LoginView from './src/pages/LoginView';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SyncProvider } from './src/context/SyncContext';
import SettingsView from './src/pages/SettingsView';

const Stack = createNativeStackNavigator();

export default function App() {


  const { user } = useAuth();


  useEffect(() => {

    const fetchQuestions = async () => {
      try {
        const questions = await questionsService.fetchAll();
        console.warn('Questões:', questions.length);
      } catch (error) {
        console.error('Erro ao buscar questões:', error);
      }
    };

    const cleardata = async () => {
      try {
        await questionsService.clearDatabase();
      } catch (error) {
        console.error('Erro ao limpar dados:', error);
      }
    }

    // cleardata();

    if (user?.id) {
      fetchQuestions();
    }

    console.log(user?.nome);

  }, [user]);

  return (
    <NavigationContainer>
      <AuthProvider>
        <SyncProvider>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="HomeView"
              options={{ headerShown: false }}
              component={HomeView} />
            <Stack.Screen
              name="ChoseGroupQuestions"
              options={{ title: 'Escolha Grupo' }}
              component={ChoseGroupQuestions} />
            <Stack.Screen
              name='UserView'
              options={{ title: 'Login' }}
              component={LoginView}
            />
            <Stack.Screen
              name="GameView"
              options={{ title: 'Quiz' }}
              component={GameView} />
            <Stack.Screen
              name='SettingsView'
              options={{ title: 'Ajustes' }}
              component={SettingsView}
            />
          </Stack.Navigator>
        </SyncProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}



