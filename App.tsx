import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeView from './src/pages/HomeView';
import ChoseGroupQuestions from './src/pages/ChooseGroupQuestions';
import GameView from './src/pages/GameView';
import { useDatabaseInitialize } from './src/hooks/use-database-initialize';

import DATA from './src/database/questions.json';
import { profileUserService, questionsGroupService } from './src/services';
import { useEffect } from 'react';
import { CreateQuestionsGroupParams } from './src/services/QuestionsGroupService';
import UserView from './src/pages/UserView';
import { questionsService } from './src/services';
import LoginView from './src/pages/LoginView';
import { AuthProvider } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {

  const { ready } = useDatabaseInitialize();

  const handlePopulateDB = async () => {

    try {
        for (const groupParams of DATA) {
          const formattedQuestions = groupParams.questions.map(question => ({
            nome: question.nome,
            descricao: question.descricao,
            resposta: question.resposta ? {
              resposta_1: question.resposta.resposta_1,
              resposta_2: question.resposta.resposta_2,
              resposta_3: question.resposta.resposta_3,
              resposta_4: question.resposta.resposta_4,
              resposta_correta: question.resposta.resposta_correta,
              active: true, 
            } : undefined,
          }));
          
          const group: CreateQuestionsGroupParams = {
            nome: groupParams.nome,
            questions: formattedQuestions,
          };
          
          await questionsGroupService.create(group);

        }

    } catch (error) {
      console.error('Falha ao popular BD:', error);
    }
  };

  const checkDatabaseFilled = async () => {
    try {
      const groups = await questionsGroupService.fetchAll();
      return groups.length > 0;

    } catch (error) {
      console.error('Erro ao verificar se o BD está preenchido:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (ready) {
        const isFilled = await checkDatabaseFilled();        

        if (!isFilled) {
          await handlePopulateDB();
        }
      } else {
        console.info('Banco de dados já preenchido');
      }
    };

  fetchData();

  // questionsService.clearDatabase()
  }, [ready]);

  useEffect(() => { 
      if (ready) {
        const fetchUsuarios = async () => {
        try {
          const users = await profileUserService.fetchAll();
          console.error('Usuários:', users.map(user => user.nome));
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
        }
      };
      fetchUsuarios();
    }
    }, [ready]);

  return (
    <AuthProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
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
      </Stack.Navigator>
    </NavigationContainer>
    </AuthProvider>
  );
}



