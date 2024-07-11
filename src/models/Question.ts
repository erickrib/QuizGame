import {
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    Relation,
  } from "typeorm";
  import { QuestionsGroup } from "./QuestionsGroup";
  import { QuestionAnswer } from "./QuestionAnswer";
import { QuestionStudent } from "./QuestionStudent";
  
  @Entity("question")
  export class Question {
    @PrimaryColumn({ type: 'int' })
    id!: number;
  
    @Column({ name: "nome", type: "varchar" })
    nome!: string;
  
    @Column({ name: "descricao", type: "varchar" })
    descricao!: string;
  
    @ManyToOne(() => QuestionsGroup, group => group.questions)
    grupo!: QuestionsGroup;

    @OneToOne(() => QuestionAnswer, answer => answer.questao, { cascade: true })
    resposta!: Relation<QuestionAnswer>;

    @OneToOne(() => QuestionStudent, questionStudent => questionStudent.questao)
    questao_respondida!: Relation<QuestionStudent>;
  }
