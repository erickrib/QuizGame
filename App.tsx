import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useDatabaseInitialize } from './src/hooks/use-database-initialize';
import { sqliteService } from './src/database/SQLiteDatabaseService';
import QuestionGroup from './src/services/QuestionsGroupService';
import { CreateQuestionsGroupParams } from './src/services/QuestionsGroupService';
import { useEffect } from 'react';
import HomeView from './src/pages/HomeView';
import ChoseGroupQuestions from './src/pages/ChooseGroupQuestions';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GameView from './src/pages/GameView';

const Stack = createNativeStackNavigator();

export default function App() {
  const { ready } = useDatabaseInitialize();

  const handleCreateQuestion = async () => {
    try {
      const newGroupParams: CreateQuestionsGroupParams = {
        nome: 'Nome do grupo de questões',
        questions: [
          {
            nome: 'Nome da questão',
            descricao: 'Descrição da questão',
          },
        ],
      };

      const repository = sqliteService;

      await QuestionGroup.create(repository, newGroupParams);

    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  const handleFetchAllQuestionsGroups = async () => {
    try {
      const repository = sqliteService;

      const groups = await QuestionGroup.fetchAll(repository);

      console.log('Groups:', groups.length);
    } catch (error) {
      console.error('Failed to fetch all questions groups:', error);
    }
  }

  useEffect(() => {
    if (ready) {
      // handleCreateQuestion();
      handleFetchAllQuestionsGroups();
    }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


