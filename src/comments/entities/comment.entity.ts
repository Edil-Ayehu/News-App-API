import { Article } from "src/articles/entities/article.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    content: string;

    @ManyToOne(() => User)
    user:User;

    @ManyToOne(() => Article, (article) => article.comments)
    article: Article;

    @CreateDateColumn()
    createdAt: Date;
}