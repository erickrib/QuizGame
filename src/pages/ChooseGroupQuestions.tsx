import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import CardGroupQuestions from '../components/CardGroupQuestions/CardGroupQuestions';
import { useNavigation } from '@react-navigation/native';
import { questionsGroupService } from '../services';
import { QuestionsGroup } from '../models/QuestionsGroup';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

import { Ionicons } from '@expo/vector-icons';
import { useSync } from '../context/SyncContext';
import { FontAwesome5 } from '@expo/vector-icons';
import useLanguage from '../hooks/useLanguage';
import { error } from 'console';

const ChoseGroupQuestions: React.FC = () => {

    const [groups, setGroups] = useState<QuestionsGroup[]>([]);
    const navigation = useNavigation<any>();

    const { user, signOut } = useAuth();
    const { isSyncEnabled } = useSync();
    const [selectedLanguage] = useLanguage();

    const handleNavigate = (group: QuestionsGroup) => {
        navigation.navigate('GameView', { group });
    }

    const handleLogout = async () => {
        await signOut();
        navigation.navigate('HomeView');
    }

    useEffect(() => {

        const fetchData = async () => {
            try {
                const groups = await questionsGroupService.fetchAll(selectedLanguage);
                setGroups(groups);

            } catch (error) {
                console.error('Erro ao buscar grupos de perguntas:', error);
            }
        };

        fetchData();

    }, [selectedLanguage]);

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.containerSync}>
                        <FontAwesome5 name="sync-alt" size={15} color="gray" />
                        <Text style={styles.textSync}>{isSyncEnabled ? 'Sincronização ativada' : 'Sincronização desativada'}</Text>
                    </View>
                    <View style={styles.containerProfile}>
                        <View style={styles.containerName}>
                            <MaterialIcons name='account-circle' size={40} color="orange" />
                            <Text style={styles.userName}>{user?.nome}</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonExit} onPress={handleLogout}>
                            <Text>Sair</Text>
                            <Ionicons style={styles.exit} name="exit" size={24} color="gray" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.title}>Escolha o grupo de perguntas</Text>
                    <View style={styles.cardContainer}>
                        <View style={styles.cardRow}>
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
    loadingContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textSync: {
        color: 'gray',
        fontSize: 16,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 0,
        marginTop: 25,

    },
    containerSync: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    containerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        width: '100%',
    },
    containerName: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 'auto',
        width: '100%',
        justifyContent: 'center',
    },
    buttonExit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#E5E5E5',
        padding: 5,
        marginRight: 10,
        gap: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#4B4B4B',
        alignSelf: 'flex-start',
        marginTop: 60,
        marginBottom: 30,
        marginHorizontal: 'auto',
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
    },
    exit: {

    }
});

export default ChoseGroupQuestions;

