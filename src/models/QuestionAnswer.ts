import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation } from "typeorm";
import { Question } from "./Question";

@Entity("question_answer")
export class QuestionAnswer {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ name: "resposta_1", type: "varchar", nullable: true })
  resposta_1!: string | null;

  @Column({ name: "resposta_2", type: "varchar", nullable: true }) 
  resposta_2!: string | null;

  @Column({ name: "resposta_3", type: "varchar", nullable: true }) 
  resposta_3!: string | null;

  @Column({ name: "resposta_4", type: "varchar", nullable: true }) 
  resposta_4!: string | null;

  @Column({ name: "resposta_correta", type: "varchar" })
  resposta_correta!: string;

  @OneToOne(() => Question, question => question.resposta)
  @JoinColumn()
  questao!: Relation<Question>;
}

