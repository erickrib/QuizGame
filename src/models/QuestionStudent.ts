import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { User } from './User';
import { Question } from './Question';

@Entity('question_student')
export class QuestionStudent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'status_resposta', type: 'varchar', nullable: true })
    statusResposta?: string;

    @Column({ name: 'codigo_atividade', type: 'varchar', nullable: true })
    codigoAtividade?: string;

    @Column({ name: 'tempo_execucao', type: 'varchar', nullable: true })
    tempo_execucao?: number;

    @Column({ name: 'is_pending_sync', type: 'boolean', default: true })
    isPendingSync: boolean;

    @
    ManyToOne(() => User, user => user.questoes_realizadas, { cascade: true })
    perfilUsuario!: User;

    @OneToOne(() => Question, question => question.questao_respondida, { cascade: true })
    @JoinColumn()
    questao!: Question;

}
