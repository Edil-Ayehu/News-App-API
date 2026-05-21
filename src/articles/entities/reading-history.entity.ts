import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class ReadingHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.readingHistories, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Article, (article) => article.readingHistories, {
    onDelete: 'CASCADE',
  })
  article: Article;

  @Column({ default: 1 })
  viewsCount: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  lastViewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
