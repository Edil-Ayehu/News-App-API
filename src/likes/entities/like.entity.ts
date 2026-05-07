import { Article } from "src/articles/entities/article.entity";
import { User } from "src/user/entities/user.entity";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['user', 'article'])
export class Like {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => User)
    user: User

    @ManyToOne(() => Article, (article) => article.likes, 
    {onDelete: 'CASCADE'},
   )
    article: Article

    @CreateDateColumn()
    createdAt: Date
}