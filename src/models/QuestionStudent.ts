import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { PerfilUsuario } from './ProfileUser';

@Entity('question_student')
export class QuestionStudent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'questao_id', type: 'bigint' })
    atividadeId!: number;

    @Column({ name: 'status_resposta', type: 'varchar', nullable: true })
    statusResposta?: string;

    @Column({ name: 'active', type: 'boolean', default: true })
    active!: boolean;

    @Column({ name: 'codigo_atividade', type: 'varchar', nullable: true })
    codigoAtividade?: string;

    @ManyToMany(() => PerfilUsuario, user => user.questoes_realizadas)
    perfilUsuario!: PerfilUsuario;

}
