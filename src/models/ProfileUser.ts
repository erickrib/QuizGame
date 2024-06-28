import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { QuestionStudent } from './QuestionStudent';

@Entity('PerfilUsuario')
export class PerfilUsuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'nome', type: "varchar" })
    nome!: string;

    @OneToMany(() => QuestionStudent, questionStudent => questionStudent.perfilUsuario)
  questoes_realizadas!: QuestionStudent[];
}