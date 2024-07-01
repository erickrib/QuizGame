import {
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
  } from "typeorm";
  import { QuestionsGroup } from "./QuestionsGroup";
  import { QuestionAnswer } from "./QuestionAnswer";
  
  @Entity("question")
  export class Question {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ name: "nome", type: "varchar" })
    nome!: string;
  
    @Column({ name: "descricao", type: "varchar" })
    descricao!: string;
  
    @ManyToOne(() => QuestionsGroup, group => group.questions)
    grupo!: QuestionsGroup;

    @OneToOne(() => QuestionAnswer, answer => answer.questao, { cascade: true })
    resposta!: Relation<QuestionAnswer>;

  }
