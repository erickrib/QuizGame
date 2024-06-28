import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import CardGroupQuestions from '../components/CardGroupQuestions/CardGroupQuestions';
import { useNavigation } from '@react-navigation/native';

const ChoseGroupQuestions = () => {

    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('GameView');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Escolha o grupo de perguntas</Text>
            <View style={styles.cardContainer}>
                <View style={styles.cardRow}>
                    <CardGroupQuestions onPress={handlePress} text="Material Dourado" />
                    <CardGroupQuestions onPress={handlePress} text="Material Dourado" />
                </View>
                <View style={styles.cardRow}>
                    <CardGroupQuestions onPress={handlePress}text="Material Dourado" />
                    <CardGroupQuestions onPress={handlePress} text="Material Dourado"/>
                </View>
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

