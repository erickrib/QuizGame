import { CreateQuestionsGroupParams } from '../services/QuestionsGroupService';
import { questionsService } from '../services';
import { questionsGroupService } from '../services';

interface Activity {
    id: number;
    nome: string;
    descricao: string;
    produtoId: number;
    nivelAtividade: number;
    tipoAtividade: string;
    idioma: string;
    codigoAtividade: string;
    resposta1: string | null;
    resposta2: string | null;
    resposta3: string | null;
    resposta4: string | null;
    respostaCorreta: string;
}

export const transformActivities = async (
    activities: Activity[],
) => {
    const localQuestions = await questionsService.fetchAll(); 
    const localQuestionIds = localQuestions.map(question => question.id);

    console.log('localQuestions', localQuestions);

    const serverQuestionIds = activities.map(activity => activity.id);

    const questionsToAdd = activities.filter(activity => !localQuestionIds.includes(activity.id));

    const questionsToUpdate = activities.filter(activity => {
        const localQuestion = localQuestions.find(q => q.id === activity.id);
        
        if (localQuestion) {
            return  activity.produtoId !== localQuestion.grupo.id ||
            activity.nome !== localQuestion.nome ||
            activity.descricao !== localQuestion.descricao ||
            activity.idioma !== localQuestion.idioma ||
            activity.codigoAtividade !== localQuestion.codigo ||
            activity.tipoAtividade !== localQuestion.tipo ||
            (activity.resposta1 !== null && activity.resposta1 !== localQuestion.resposta.resposta_1) ||
            (activity.resposta2 !== null && activity.resposta2 !== localQuestion.resposta.resposta_2) ||
            (activity.resposta3 !== null && activity.resposta3 !== localQuestion.resposta.resposta_3) ||
            (activity.resposta4 !== null && activity.resposta4 !== localQuestion.resposta.resposta_4) ||
            (activity.respostaCorreta!== localQuestion.resposta.resposta_correta);
        }
        
        return false; 
    });

    const questionsToDelete = localQuestions.filter(question => !serverQuestionIds.includes(question.id));

    for (const question of questionsToDelete) {
        await questionsService.delete(question.id);
    }

    const groupedActivitiesToAdd: Record<number, Activity[]> = {};
    questionsToAdd.forEach(activity => {
        if (!groupedActivitiesToAdd[activity.produtoId]) {
            groupedActivitiesToAdd[activity.produtoId] = [];
        }
        groupedActivitiesToAdd[activity.produtoId].push(activity);
    });

    for (const produtoId in groupedActivitiesToAdd) {
        const groupName = `material-${produtoId}`;
        const groupParams: CreateQuestionsGroupParams = {
            id: +produtoId,
            nome: groupName,
            questions: groupedActivitiesToAdd[+produtoId].map(activity => ({
                id: activity.id,
                nome: activity.nome,
                descricao: activity.descricao,
                grupo_id: activity.produtoId,
                idioma: activity.idioma,
                codigo: activity.codigoAtividade,
                tipo: activity.tipoAtividade,
                resposta: {
                    resposta_1: activity.resposta1,
                    resposta_2: activity.resposta2,
                    resposta_3: activity.resposta3,
                    resposta_4: activity.resposta4,
                    resposta_correta: activity.respostaCorreta,
                }
            }))
        };

        await questionsGroupService.create(groupParams);
    }

    for (const activity of questionsToUpdate) {
        const groupName = `material${activity.produtoId}`;

        const groupParams: CreateQuestionsGroupParams = {
            id: activity.produtoId,
            nome: groupName,
            questions: [
                {
                    id: activity.id,
                    nome: activity.nome,
                    descricao: activity.descricao,
                    grupo_id: activity.produtoId,
                    idioma: activity.idioma,
                    codigo: activity.codigoAtividade,
                    tipo: activity.tipoAtividade,
                    resposta: {
                        resposta_1: activity.resposta1,
                        resposta_2: activity.resposta2,
                        resposta_3: activity.resposta3,
                        resposta_4: activity.resposta4,
                        resposta_correta: activity.respostaCorreta,
                    }
                }
            ]
        };

        await questionsGroupService.update(groupParams);
    }

};
