import { Comment } from "src/comments/entities/comment.entity";
import { Like } from "src/likes/entities/like.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title:string

    @Column({unique: true})
    slug:string

    @Column()
    summary: string

    @Column('text')
    content: string

    @Column({type: 'text', nullable: true})
    imageUrl: string | null

    @Column({default: false})
    isFeatured: boolean

    @Column({default: 0})
    viewsCount: number

    @ManyToOne(() => User)
    author: User

    @OneToMany(() => Comment, (comment) => comment.article)
    comments: Comment[]

    @OneToMany(() => Like, (like) => like.article)
    likes: Like[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
