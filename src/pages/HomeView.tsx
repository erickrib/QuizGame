import { Text, StyleSheet, SafeAreaView, Image, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import QuizButton from '../components/QuizButton/QuizButton';
import { useAuth } from '../context/AuthContext';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { FontAwesome5 } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

const HomeView: React.FC = () => {
    const navi = useNavigation<any>();

    const { user } = useAuth();
    const isConnected = useNetworkStatus();

    const handleStartQuiz = () => {
        navi.navigate(user?.id ? "ChoseGroupQuestions" : "UserView");
    };

    const handleSettings = () => {
        navi.navigate("SettingsView");
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../../assets/detail.png')}
                style={styles.backgroundImage}
            />
            <View style={styles.containerConection}>
                <FontAwesome5 name="wifi" size={20} color={isConnected ? 'green' : 'gray'} />
                <Text style={[styles.textConnection, isConnected ? { color: 'green' } : { color: 'gray' }]}>{isConnected ? 'Online' : 'Offline'}</Text>
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleSettings}>
                <Fontisto name="player-settings" size={40} color="#1356A1" />
            </TouchableOpacity>
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
    buttonContainer: {
        marginLeft: 'auto',
        marginRight: 10,
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
        marginVertical: 'auto',
        transform: [{ rotate: '8deg' }]
    }
});

export default HomeView;
