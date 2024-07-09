import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import CardGroupQuestions from '../components/CardGroupQuestions/CardGroupQuestions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { questionsGroupService } from '../services';
import { QuestionsGroup } from '../models/QuestionsGroup';
import { User } from '../models/User';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

interface ChoseGroupQuestionsParams {
    user: User;
}

const ChoseGroupQuestions: React.FC = () => {

    const [groups, setGroups] = useState<QuestionsGroup[]>([]);
    const navigation = useNavigation<any>();

    const route = useRoute();
    const { user } = useAuth();

    const handleNavigate = (group: QuestionsGroup) => {
        navigation.navigate('GameView', { group, user });
    }

    useEffect(() => {
        console.log('user:', user);
        
        const fetchData = async () => {
            try {
                const groups = await questionsGroupService.fetchAll();             
                setGroups(groups);
            } catch (error) {
                console.error('Erro ao buscar grupos de perguntas:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerProfile}>
                <MaterialIcons name='account-circle' size={40} color="orange" />
                <Text style={styles.userName}>{user.nome}</Text>
            </View>
            <Text style={styles.title}>Escolha o grupo de perguntas</Text>
            <View style={styles.cardContainer}>
                {groups.map((group) => (
                    <View key={group.id} style={styles.cardRow}>
                        <CardGroupQuestions onPress={() => handleNavigate(group)} text={group.nome} />
                    </View>
                ))}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 0,
    },
    containerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#4B4B4B',
        alignSelf: 'flex-start',
        marginTop: 60,
        marginBottom: 30,
        marginHorizontal: 'auto'
    },
    cardContainer: {
        flex: 1,
        width: '100%',
        marginTop: 40,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        gap: 10,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4B4B4B',
        marginLeft: 10,
    }
});

export default ChoseGroupQuestions;

