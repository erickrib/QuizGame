import { Text, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QuizButton from '../components/QuizButton/QuizButton';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const HomeView: React.FC = () => {
    const navi = useNavigation<any>();
    
    const { user } = useAuth();

    const handleStartQuiz = () => {
        navi.navigate(user?.id ? "ChoseGroupQuestions" : "UserView");
    };

    useEffect(() => {
        console.error('Usuário:', user);
    }, [user]);

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
