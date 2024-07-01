import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import CardGroupQuestions from '../components/CardGroupQuestions/CardGroupQuestions';
import { useNavigation } from '@react-navigation/native';
import { questionsGroupService } from '../services';
import { QuestionsGroup } from '../models/QuestionsGroup';

const ChoseGroupQuestions: React.FC = () => {

    const [groups, setGroups] = useState<QuestionsGroup[]>([]);
    const navigation = useNavigation<any>();

    const handlePress = () => {
        navigation.navigate('GameView');
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
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Escolha o grupo de perguntas</Text>
            <View style={styles.cardContainer}>
                {groups.map((group, index) => (
                    <View style={styles.cardRow}>
                        <CardGroupQuestions key={index} onPress={handlePress} text={group.nome} />
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#4B4B4B',
        alignSelf: 'flex-start',
        marginTop: 80,
        marginBottom: 30,
        marginHorizontal: 'auto'
    },
    cardContainer: {
        flex: 1,
        width: '100%',
        marginTop: 80,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        gap: 10,
    },
});

export default ChoseGroupQuestions;

