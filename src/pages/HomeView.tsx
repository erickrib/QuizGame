// views/HomeView.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import QuizButton from '../components/QuizButton/QuizButton';
import { sqliteService } from '../database/SQLiteDatabaseService';
import { findByQuestionsGroup } from '../services/QuestionService';
import { Question } from '../models/Question';


const HomeView = () => {
    const navi = useNavigation<any>();

    const handleStartQuiz = () => {
        navi.navigate("Escolha grupo");
    };
    const [questions, setQuestions] = useState<Question[]>([]);

    const fetchQuestions = async () => {
        try {
            const repository = sqliteService;
            const questionsResult = await findByQuestionsGroup(repository, { id: 1});
            setQuestions(questionsResult);

        } catch {
          //  console.error("Failed to fetch questions", error)
        }
    }

    useEffect(() => {
        fetchQuestions();
    }, [])
    

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Quiz</Text>
            <QuizButton text={"Start"} onPress={handleStartQuiz} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 60,
        fontWeight: 'bold',
        marginTop: 'auto',
        transform: [{ rotate: '8deg' }]
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    }
});

export default HomeView;
