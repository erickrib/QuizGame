import { api } from "../api/api";
import { questionStudentService } from "../services";

export const syncPendingAnswers = async (token: string) => {

    try {
        const pendingAnswers = await questionStudentService.findPendingSyncAnswers();

        prettyPrintJSON(pendingAnswers);

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

            // Marca as respostas como sincronizadas no banco de dados local
            await questionStudentService.markAsSynced(pendingAnswers);

            console.log("Respostas pendentes sincronizadas com sucesso")
        }
    } catch (error) {
        console.error('Erro ao sincronizar respostas pendentes:', error);
    }
};

function prettyPrintJSON(jsonArray) {
    console.log(JSON.stringify(jsonArray, null, 2));
}