import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import QuizButton from '../components/QuizButton/QuizButton';
import CustomProgressBar from '../components/CustomProgressBar/CustomProgressBar';
import ConfirmExitPopup from '../components/ConfirmExitPopup/ConfirmExitPopup';
import AlertFeedback from '../components/AlertFeedback/AlertFeedback';
import { useNavigation, useRoute } from '@react-navigation/native';
import { QuestionsGroup } from '../models/QuestionsGroup';
import { questionAnswerService } from '../services';
import { QuestionAnswer } from '../models/QuestionAnswer';
import AnswerOption from '../components/AnswerOption/AnswerOption';
import { Question } from '../models/Question';
import { questionStudentService } from '../services';
import { User } from '../models/User';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';
import { useSync } from '../context/SyncContext';

interface GameViewParams {
    group: QuestionsGroup;
    user: User;
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
    const [respostaInput, setRespostaInput] = useState<string>('');

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
    const { user, token } = useAuth();
    const { group } = route.params as GameViewParams;
    const { syncPendingAnswersUser } = useSync();

    const currentQuestion: Question = group.questions[currentQuestionIndex];
    const currentAnswer: QuestionAnswer = answers[0];
    const typeQuestion = currentQuestion.resposta?.resposta_1 === null ? 'input' : 'multiple';

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
        navigation.navigate('ChoseGroupQuestions', { user });
    }

    const handleSelectAnswer = (answer: string) => {
        setSelectedAnswer(answer);
    };

    // Função para verificar se a resposta está correta
    const checkAnswer = async () => {

        if (!selectedAnswer && !respostaInput) { return; }

        const { resposta_correta: correctAnswer } = currentAnswer;
        let isCorrect = false;

        // Simplifica a lógica de verificação da resposta correta
        if (typeQuestion === 'multiple') {
            isCorrect = selectedAnswer === correctAnswer;
        } else {
            isCorrect = respostaInput === correctAnswer;
        }

        const type = isCorrect ? "success" : "error";
        setFeedback({ ...feedback, type, visible: true })

        updateAnsweredQuestions(isCorrect);

        await logResponse(isCorrect? 'ACERTOU' : 'ERROU');
    };

    // Atualiza o estado das perguntas respondidas com base na correção
    const updateAnsweredQuestions = (isCorrect) => {
        setAnsweredQuestions(prevState => ({
            ...prevState,
            totalRespondidas: prevState.totalRespondidas + 1,
            ...(isCorrect && {
                totalCertas: prevState.totalCertas + 1,
                indicesCertas: [...prevState.idCertas, currentQuestion.id]
            }),
            ...(isCorrect || {
                totalErradas: prevState.totalErradas + 1,
                indicesErradas: [...prevState.idErradas, currentQuestion.id]
            })
        }));
    };

    // Registra a resposta
    const logResponse = async (status: string) => {
        const statusResposta = status;
        
        await questionStudentService.create({
            id_atividade: currentQuestion.id,
            id_perfil_usuario: user.id,
            status_resposta: statusResposta,
            codigo_atividade: currentQuestion.codigo,
            tempo_execucao: 0,
            is_pending_sync: true,
        });

        // Sincroniza as respostas pendentes
        await syncPendingAnswersUser();
    };

    // Função para selecionar a próxima pergunta
    const selectNextQuestion = (group, answeredQuestions, currentQuestionIndex) => {
        // Verifica se ainda há perguntas a serem respondidas
        if (currentQuestionIndex + 1 < group.questions.length) {
            return currentQuestionIndex + 1;
        }

        // Filtra as perguntas não respondidas
        const unansweredQuestions = group.questions.filter((_, index) =>
            !answeredQuestions.idCertas.includes(index) &&
            !answeredQuestions.idErradas.includes(index)
        );

        // Seleciona uma pergunta aleatória dentre as não respondidas
        if (unansweredQuestions.length > 0) {
            const randomUnansweredIndex = Math.floor(Math.random() * unansweredQuestions.length);
            const selectedIndex = unansweredQuestions[randomUnansweredIndex].id;

            const validIndex = group.questions.findIndex(question => question.id === selectedIndex);
            return validIndex !== -1 ? validIndex : null; // Retorna null se não encontrar uma pergunta válida
        }

        return null;
    };

    // Função para avançar para a próxima pergunta
    const handleNextQuestion = (status?: string) => {
        setFeedback({ ...feedback, visible: false });
        setSelectedAnswer(null);

        if (answeredQuestions.totalRespondidas >= MAX_QUESTIONS) {
            handleOpenPopupFinishGame();
        } else {
            const nextQuestionIndex = selectNextQuestion(group, answeredQuestions, currentQuestionIndex);
            if (nextQuestionIndex !== null) {
                setCurrentQuestionIndex(nextQuestionIndex);
            }
        }

        if (status) {
            logResponse(status);
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
                    <Text style={styles.title}>{currentQuestion?.descricao}</Text>
                    {typeQuestion === 'input' ?
                        <View style={styles.gridContainer}>
                            <AnswerOption
                                answer={currentAnswer?.resposta_1}
                                isActive={selectedAnswer == currentAnswer?.resposta_1}
                                onPress={handleSelectAnswer}
                            />
                            <AnswerOption
                                answer={currentAnswer?.resposta_2}
                                isActive={selectedAnswer == currentAnswer?.resposta_2}
                                onPress={handleSelectAnswer}
                            />
                            <AnswerOption
                                answer={currentAnswer?.resposta_3}
                                isActive={selectedAnswer == currentAnswer?.resposta_3}
                                onPress={handleSelectAnswer} />
                            <AnswerOption
                                answer={currentAnswer?.resposta_4}
                                isActive={selectedAnswer == currentAnswer?.resposta_4}
                                onPress={handleSelectAnswer} />
                        </View>
                        :
                        <TextInput
                            style={styles.input}
                            placeholder="Resposta"
                            value={respostaInput}
                            onChangeText={setRespostaInput}
                            autoCapitalize="none"
                        />
                    }
                </View>

                <View style={styles.buttonContainer} >
                    <QuizButton text={"Responder"} onPress={checkAnswer} />
                    <QuizButton color='#868686' colorShadow='#9D9D9D' text={"Pular"} onPress={() => handleNextQuestion("PULOU")} />
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
    input: {
        height: 60,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#FFF',
        width: '100%',
    }
});


export default GameView;