import { api } from "../api/api";
import { questionStudentService } from "../services";
import { CreateQuestionStudentParams } from "../services/QuestionStudentService";

type Answer = {
    perfilUsuarioId: number;
    atividadeId: number;
    tempoExecucao: number;
    statusResposta: string;
    codigoAtividade: string;
};

async function handlePendingAnswers(token: string): Promise<void> {
    try {
        const pendingAnswers = await questionStudentService.findPendingSyncAnswers();

        if (pendingAnswers.length > 0) {
            const formattedData = pendingAnswers.map(answer => ({
                perfilUsuarioId: answer.perfilUsuario.id,
                atividadeId: answer.questao.id,
                codigoAtividade: answer.codigoAtividade,
                tempoExecucao: answer.tempo_execucao || 0,
                statusResposta: answer.statusResposta,
            }));

            await api.post('/atividadealuno/savelist', formattedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            await questionStudentService.markAsSynced(pendingAnswers);

            console.log("Respostas pendentes sincronizadas com sucesso");
        }
    } catch (error) {
        console.error('Erro ao sincronizar respostas pendentes:', error);
    }
}

function prettyPrintJSON(jsonArray) {
    console.log(JSON.stringify(jsonArray, null, 2));
}

function identifyChanges(remoteAnswers: Answer[], localAnswers: any) {

    const localStudentAnswerIds = remoteAnswers.map(studentAnswer => studentAnswer.atividadeId);
    const serverStudentAnswerCodes = localAnswers.map(activity => activity.id_atividade);

    const answersStudentToAdd = remoteAnswers.filter(studentAnswer => !localStudentAnswerIds.includes(studentAnswer.atividadeId));

    const answersStudentToUpdate = remoteAnswers.filter(answers => {
        const localQuestion = localAnswers.find(a => a.id_atividade === answers.atividadeId);

        if (localQuestion) {
            return answers.codigoAtividade !== localQuestion.codigoAtividade ||
            answers.statusResposta !== localQuestion.statusResposta ||
            answers.tempoExecucao !== localQuestion.tempo_execucao ||
            answers.perfilUsuarioId !== localQuestion.id_perfil_usuario;     
        }

        return false; 
    });

    const answersStudentToDelete = localAnswers.filter(question => !serverStudentAnswerCodes.includes(question.id_atividade));

    return { answersStudentToAdd, answersStudentToUpdate, answersStudentToDelete };
}

const handleDeletions = async (answersStudentToDelete: any[]) => {
    for (const answer of answersStudentToDelete) {
        if (answer && answer.id_atividade) {
            await questionStudentService.delete(answer.id);
        } else {
            console.warn('Tentando deletar um progresso inválido:', answer);
        }
    }
};

const handleAdditions = async (answersStudentToAdd: Answer[]) => {
    for (const answer of answersStudentToAdd) {
        const answerParams: CreateQuestionStudentParams = {
            id_perfil_usuario: answer.perfilUsuarioId,
            id_atividade: answer.atividadeId,
            status_resposta: answer.statusResposta,
            codigo_atividade: answer.codigoAtividade,
            tempo_execucao: answer.tempoExecucao,
            is_pending_sync: false
        };

        await questionStudentService.create(answerParams);
    }
}

const handleUpdates = async (answersStudentToUpdate: Answer[]) => {
    for (const answer of answersStudentToUpdate) {
        const answerParams: CreateQuestionStudentParams = {
            id_perfil_usuario: answer.perfilUsuarioId,
            id_atividade: answer.atividadeId,
            status_resposta: answer.statusResposta,
            codigo_atividade: answer.codigoAtividade,
            tempo_execucao: answer.tempoExecucao,
            is_pending_sync: false
        };

        await questionStudentService.update(answerParams);
    }
};

export const syncAnswersStudent = async (answer: Answer[], token: string) => {
    const localQuestions = await questionStudentService.fetchAll();
    const { answersStudentToAdd, answersStudentToUpdate, answersStudentToDelete } = identifyChanges(answer, localQuestions);

    try {
        await handlePendingAnswers(token);

        await Promise.all([
            handleDeletions(answersStudentToDelete),
            handleAdditions(answersStudentToAdd),
            handleUpdates(answersStudentToUpdate)
        ]);

        console.log("Sincronização do progresso do usuário concluída com sucesso");
    } catch (error) {
        console.error("Erro ao sincronizar progresso:", error);
    }
};