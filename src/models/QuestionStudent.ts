import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinColumn, Relation, ManyToOne, OneToOne } from 'typeorm';
import { User } from './User';
import { Question } from './Question';

@Entity('question_student')
export class QuestionStudent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'status_resposta', type: 'varchar', nullable: true })
    statusResposta?: string;

    @Column({ name: 'active', type: 'boolean', default: true })
    active!: boolean;

    @Column({ name: 'codigo_atividade', type: 'varchar', nullable: true })
    codigoAtividade?: string;

    @Column({ name: 'data_resposta', type: 'text', nullable: true })
    dataResposta: string;

    @
    ManyToOne(() => User, user => user.questoes_realizadas, { cascade: true })
    perfilUsuario!: User;

    @OneToOne(() => Question, question => question.questao_respondida, { cascade: true })
    @JoinColumn()
    questao!: Question;

}
