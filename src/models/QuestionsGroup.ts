import { Column, Entity, OneToMany, PrimaryColumn, Relation } from "typeorm";
import { Question } from "./Question";

@Entity("questions_group")
export class QuestionsGroup {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ name: "nome", type: "varchar" })
  nome: string;

  @OneToMany(() => Question, question => question.grupo, { cascade: true })
  questions!: Relation<Question[]>;
}