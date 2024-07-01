// views/HomeView.tsx

import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QuizButton from '../components/QuizButton/QuizButton';

const HomeView = () => {
    const navi = useNavigation<any>();

    const handleStartQuiz = () => {
        navi.navigate("Escolha grupo");
    };

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
