import { Text, StyleSheet, SafeAreaView, Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QuizButton from '../components/QuizButton/QuizButton';
import { useAuth } from '../context/AuthContext';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { FontAwesome5 } from '@expo/vector-icons';

const HomeView: React.FC = () => {
    const navi = useNavigation<any>();

    const { user } = useAuth();
    const isConnected = useNetworkStatus();

    const handleStartQuiz = () => {
        navi.navigate(user?.id ? "ChoseGroupQuestions" : "UserView");
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../../assets/detail.png')}
                style={styles.backgroundImage}
            />
            <View style={styles.containerConection}>
                <FontAwesome5 name="wifi" size={20} color={isConnected ? 'green' : 'gray'} />
                <Text style={[styles.textConnection, isConnected ? {color: 'green'} : {color: 'gray'}]}>{isConnected ? 'Online' : 'Offline'}</Text>
            </View>
            <Text style={styles.title}>Quiz</Text>
            <QuizButton text={"Start"} onPress={handleStartQuiz} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    containerConection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontWeight: 'bold',
    },
    textConnection: {
        color: 'green',
        fontWeight: 'bold',
    },
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
