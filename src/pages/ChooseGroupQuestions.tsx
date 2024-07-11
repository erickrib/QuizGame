import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import CardGroupQuestions from '../components/CardGroupQuestions/CardGroupQuestions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { questionsGroupService } from '../services';
import { QuestionsGroup } from '../models/QuestionsGroup';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const ChoseGroupQuestions: React.FC = () => {

    const [groups, setGroups] = useState<QuestionsGroup[]>([]);
    const navigation = useNavigation<any>();

    const { user } = useAuth();

    const handleNavigate = (group: QuestionsGroup) => {
        navigation.navigate('GameView', { group });
    }

    useEffect(() => {

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
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.containerProfile}>
                        <MaterialIcons name='account-circle' size={40} color="orange" />
                        <Text style={styles.userName}>{user?.nome}</Text>
                    </View>
                    <Text style={styles.title}>Escolha o grupo de perguntas</Text>
                    <View style={styles.cardContainer}>
                    <View  style={styles.cardRow}>
                        {groups.map((group) => (
                                <CardGroupQuestions key={group.id} onPress={() => handleNavigate(group)} text={group.nome} />
                           
                        ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
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
        marginTop: 10,
    },
    cardRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginHorizontal: 5,
        gap: 5,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4B4B4B',
        marginLeft: 10,
    }
});

export default ChoseGroupQuestions;

