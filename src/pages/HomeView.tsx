import { Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QuizButton from '../components/QuizButton/QuizButton';
import { useAuth } from '../context/AuthContext';

const HomeView: React.FC = () => {
    const navi = useNavigation<any>();
    
    const { user } = useAuth();

    const handleStartQuiz = () => {
        navi.navigate(user?.id ? "ChoseGroupQuestions" : "UserView");
    };
        
    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../../assets/detail.png')}
                style={styles.backgroundImage}
            />
            <Text style={styles.title}>Quiz</Text>
            <QuizButton text={"Start"} onPress={handleStartQuiz} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        position: 'absolute',
        bottom: -10,
        width: '100%',
        resizeMode: 'contain',
    },
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
    }
});

export default HomeView;
