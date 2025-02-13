import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Question } from "./Question";

@Entity("questions_group")
export class QuestionsGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "nome", type: "varchar" })
  nome: string;

  @OneToMany(() => Question, question => question.grupo, { cascade: true })
  questions!: Relation<Question[]>;
}