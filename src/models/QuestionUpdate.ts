import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('question_update')
export class QuestionUpdate {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ type: 'datetime' })
  lastUpdate: Date;
}



