import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeView from './src/pages/HomeView';
import ChoseGroupQuestions from './src/pages/ChooseGroupQuestions';
import GameView from './src/pages/GameView';
import { useDatabaseInitialize } from './src/hooks/use-database-initialize';

import DATA from './src/database/questions.json';
import { questionsGroupService } from './src/services';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();

export default function App() {

  const { ready } = useDatabaseInitialize();

  const handlePopulateDB = async () => {

    try {
      for (const groupParams of DATA) {
        await questionsGroupService.create(groupParams);
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
      const isFilled = await checkDatabaseFilled();

      if (ready && !isFilled) {
        await handlePopulateDB();
      } else {
        console.info('Banco de dados já preenchido');
      }
    };

    fetchData();
  }, [ready]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeView} />
        <Stack.Screen
          name="Escolha grupo"
          component={ChoseGroupQuestions} />
        <Stack.Screen
          name="GameView"
          component={GameView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



