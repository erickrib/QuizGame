import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import QuizButton from '../components/QuizButton/QuizButton';
import CustomProgressBar from '../components/CustomProgressBar/CustomProgressBar';
import ConfirmExitPopup from '../components/ConfirmExitPopup/ConfirmExitPopup';
import AlertFeedback from '../components/AlertFeedback/AlertFeedback';
import { useDatabaseInitialize } from '../hooks/use-database-initialize';

export default function GameView() {

    const [feedbackType, setFeedbackType] = useState('success');
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [isPopupVisible, setPopupVisible] = useState(false);

    const handlePress = (text) => {

    };

    const handleOpenPopup = () => {
        setPopupVisible(true);
    };

    const handleConfirmExit = () => {
        // Lógica para confirmar a saída
        console.log('Confirmou a saída');
        setPopupVisible(false);
    };

    const handleCancelExit = () => {
        // Lógica para cancelar a saída
        console.log('Cancelou a saída');
        setPopupVisible(false);
    };

    const handleCorrect = () => {
        setFeedbackType('success');
        setFeedbackVisible(true);
    };

    const handleCloseFeedback = () => {
        setFeedbackVisible(false);
    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <CustomProgressBar close={handleOpenPopup} progress={5} />
                <View style={styles.containerQuestion}>
                    <Text style={styles.title}>Qual é o resultado de 82 + 57?</Text>
                    <View style={styles.gridContainer}>
                        <TouchableOpacity style={styles.gridItem} onPress={() => handlePress('View 1')}>
                            <Text style={styles.gridItemText}>View 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.gridItem} onPress={() => handlePress('View 2')}>
                            <Text style={styles.gridItemText}>View 2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.gridItem} onPress={() => handlePress('View 3')}>
                            <Text style={styles.gridItemText}>View 3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.gridItem} onPress={() => handlePress('View 4')}>
                            <Text style={styles.gridItemText}>View 4</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.buttonContainer} >
                    <QuizButton text={"Responder"} onPress={() => { }} />
                    <QuizButton color='#868686' colorShadow='#9D9D9D' text={"Pular"} onPress={() => { }} />
                </View>
                <ConfirmExitPopup
                    isVisible={isPopupVisible}
                    onConfirm={handleConfirmExit}
                    onCancel={handleCancelExit}
                    title={"Tem certeza de que deseja sair?"}
                    descricao={"Todo o seu progresso atual será perdido"}
                    cancelButtonTitle={"Cancelar"}
                    confirmButtonTitle={"Sair"}
                />
            </SafeAreaView>
            {feedbackVisible &&
                <AlertFeedback
                    type={feedbackType}
                    onClose={handleCloseFeedback}
                />
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    containerQuestion: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#328AE1',
        padding: 20,
        borderRadius: 20,
        margin: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 60,
        marginTop: 20,
        color: '#fff',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    gridItem: {
        width: '48%', // Ajuste conforme necessário para o espaçamento entre os itens
        height: 90,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        marginBottom: 20, // Espaçamento entre as linhas
    },
    gridItemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginTop: 'auto',
        marginBottom: 20,
    },
});

