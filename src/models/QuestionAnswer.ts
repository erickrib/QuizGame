import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Relation } from "typeorm";
import { Question } from "./Question";

@Entity("question_nswer")
export class QuestionAnswer {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: "resposta_1", type: "varchar" })
  resposta_1!: string;

  @Column({ name: "resposta_2", type: "varchar" })
  resposta_2!: string;

  @Column({ name: "resposta_3", type: "varchar" })
  resposta_3!: string;

  @Column({ name: "resposta_4", type: "varchar" })
  resposta_4!: string;

  @Column({ name: "resposta_correta", type: "varchar" })
  resposta_correta!: string;

  @Column({ type: 'boolean', nullable: true }) 
    active: boolean;

  @OneToOne(() => Question, question => question.resposta)
  @JoinColumn()
  questao!: Relation<Question>;
}
