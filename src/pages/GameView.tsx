import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import QuizButton from '../components/QuizButton/QuizButton';
import CustomProgressBar from '../components/CustomProgressBar/CustomProgressBar';
import ConfirmExitPopup from '../components/ConfirmExitPopup/ConfirmExitPopup';
import AlertFeedback from '../components/AlertFeedback/AlertFeedback';
import { useNavigation, useRoute } from '@react-navigation/native';
import { QuestionsGroup } from '../models/QuestionsGroup';
import { questionAnswerService } from '../services';
import { QuestionAnswer } from '../models/QuestionAnswer';
import AnswerOption from '../components/AnswerOption/AnswerOption';

interface GameViewParams {
    group: QuestionsGroup;
}

type FeedbackState = {
    type: "success" | "error";
    visible: boolean;
};

const MAX_QUESTIONS = 10;

const GameView: React.FC = () => {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const [feedback, setFeedback] = useState<FeedbackState>({
        type: "success",
        visible: false,
    });

    const [answeredQuestions, setAnsweredQuestions] = useState({
        totalRespondidas: 0,
        totalCertas: 0,
        totalErradas: 0,
        idCertas: [],
        idErradas: [],
    })

    const [popupState, setPopupState] = useState({
        isVisible: false,
        title: "",
        descricao: "",
        showCancelButton: true,
    });

    const navigation = useNavigation<any>();
    const route = useRoute();
    const { group } = route.params as GameViewParams;

    const currentQuestion = group.questions[currentQuestionIndex];
    const currentAnswer = answers[0];

    const fetchAnswers = async () => {
        try {
            const answers = await questionAnswerService.findAnswersByQuestion(currentQuestion.id);
            setAnswers(answers);

            console.log('Respostas:', answers);
        } catch (error) {
            console.error('Erro ao buscar respostas:', error);
        }
    }

    const handleNavigate = () => {
        navigation.navigate('Escolha grupo');
    }

    const handlePress = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const checkAnswer = () => {
        if (selectedAnswer !== null) {
            const correctAnswer = currentAnswer.resposta_correta;
            const isCorrect = selectedAnswer === correctAnswer;

            if (isCorrect) {
                setFeedback({ ...feedback, type: "success", visible: true });

                setAnsweredQuestions(prevState => ({
                    ...prevState,
                    totalRespondidas: prevState.totalRespondidas + 1,
                    totalCertas: prevState.totalCertas + 1,
                    indicesCertas: [...prevState.idCertas, currentQuestion.id],
                }));

            } else {
                setFeedback({ ...feedback, type: "error", visible: true });

                setAnsweredQuestions(prevState => ({
                    ...prevState,
                    totalRespondidas: prevState.totalRespondidas + 1,
                    totalErradas: prevState.totalErradas + 1,
                    indicesErradas: [...prevState.idErradas, currentQuestion.id],
                }));
            }
        }
    };

    const selectNextQuestion = (group, answeredQuestions, currentQuestionIndex) => {
        if (currentQuestionIndex + 1 < group.questions.length) {
            return currentQuestionIndex + 1;
        }
    
        const unansweredQuestions = group.questions.filter((_, index) => 
           !answeredQuestions.idCertas.includes(index) && 
           !answeredQuestions.idErradas.includes(index)
        );
    
        if (unansweredQuestions.length > 0) {
            const randomUnansweredIndex = Math.floor(Math.random() * unansweredQuestions.length);
            const selectedIndex = unansweredQuestions[randomUnansweredIndex].id;
    
            const validIndex = group.questions.findIndex(question => question.id === selectedIndex);
            return validIndex!== -1? validIndex : null; // Retorna null se não encontrar uma pergunta válida
        }
    
        return null; 
    };
    
    const handleNextQuestion = () => {
        setFeedback({...feedback, visible: false });
        setSelectedAnswer(null);
    
        if (answeredQuestions.totalRespondidas >= MAX_QUESTIONS) {
            handleOpenPopupFinishGame();
        } else {
            const nextQuestionIndex = selectNextQuestion(group, answeredQuestions, currentQuestionIndex);
            if (nextQuestionIndex!== null) {
                setCurrentQuestionIndex(nextQuestionIndex);
            }
        }
    };

    const handleOpenPopupCloseGame = () => {
        setPopupState(prevState => ({ ...prevState, isVisible: true, title: 'Deseja sair do jogo?', descricao: 'Se sair, seu progresso será perdido.', showCancelButton: true }));
    };

    const handleOpenPopupFinishGame = () => {
        setPopupState(prevState => ({ ...prevState, isVisible: true, title: 'Quiz Finalizado!', descricao: `Você completou o quiz com ${answeredQuestions.totalCertas} de ${MAX_QUESTIONS} perguntas corretas`, showCancelButton: false }));
    }

    const handleConfirmExit = () => {
        handleNavigate();
        setPopupState(prevState => ({ ...prevState, isVisible: false }));
    };

    const handleCancelExit = () => {
        setPopupState(prevState => ({ ...prevState, isVisible: false }));
    };


    useEffect(() => {
        fetchAnswers();
    }, [currentQuestion]);

    return (
        <>
            <SafeAreaView style={styles.container}>
                <CustomProgressBar close={handleOpenPopupCloseGame} progress={answeredQuestions.totalRespondidas} />
                <View style={styles.containerQuestion}>
                    <Text style={styles.title}>{currentQuestion?.nome}</Text>
                    <View style={styles.gridContainer}>
                        <AnswerOption
                            answer={currentAnswer?.resposta_1}
                            isActive={selectedAnswer == currentAnswer?.resposta_1}
                            onPress={handlePress}
                        />
                        <AnswerOption
                            answer={currentAnswer?.resposta_2}
                            isActive={selectedAnswer == currentAnswer?.resposta_2}
                            onPress={handlePress}
                        />
                        <AnswerOption
                            answer={currentAnswer?.resposta_3}
                            isActive={selectedAnswer == currentAnswer?.resposta_3}
                            onPress={handlePress} />
                        <AnswerOption
                            answer={currentAnswer?.resposta_4}
                            isActive={selectedAnswer == currentAnswer?.resposta_4}
                            onPress={handlePress} />
                    </View>
                </View>

                <View style={styles.buttonContainer} >
                    <QuizButton text={"Responder"} onPress={checkAnswer} />
                    <QuizButton color='#868686' colorShadow='#9D9D9D' text={"Pular"} onPress={handleNextQuestion} />
                </View>
                <ConfirmExitPopup
                    isVisible={popupState.isVisible}
                    onConfirm={handleConfirmExit}
                    onCancel={handleCancelExit}
                    title={popupState.title}
                    descricao={popupState.descricao}
                    cancelButtonTitle={"Cancelar"}
                    confirmButtonTitle={"Sair"}
                    showCancelButton={popupState.showCancelButton}
                />
            </SafeAreaView>
            {feedback.visible &&
                <AlertFeedback
                    type={feedback.type}
                    onClose={handleNextQuestion}
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
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginTop: 'auto',
        marginBottom: 20,
    },
});


export default GameView;