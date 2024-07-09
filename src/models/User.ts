import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { QuestionStudent } from './QuestionStudent';

@Entity('User')
export class User {
  @PrimaryColumn({ type: 'int' })
  id!: number;

  @Column({ name: 'nome', type: 'varchar' })
  nome!: string;

  @Column({ name: 'email', type: 'varchar' })
  email!: string;

  @Column({ name: 'profileId', type: 'varchar' })
  profileId!: string;

  @Column({ name: 'companyId', type: 'varchar' })
  companyId!: string;

  @Column({ name: 'accountActive', type: 'varchar' })
  accountActive!: string;

  @OneToMany(() => QuestionStudent, questionStudent => questionStudent.perfilUsuario)
  questoes_realizadas!: QuestionStudent[];
}