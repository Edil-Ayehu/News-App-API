import { Bookmark } from "src/bookmarks/entities/bookmark.entity";
import { Category } from "src/categories/entities/category.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Like } from "src/likes/entities/like.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ArticleStatus } from "../enums/article-status.enum";
import { ReadingHistory } from "./reading-history.entity";

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


    @Column({
        default: 1,
    })
    readingTime: number  // reading time generated automatically by calculating based on content-length

    @Column('text', {
        array: true,
        default: [],
    })
    tags: string[]

    @Column({
        type: 'enum',
        enum: ArticleStatus,
        default: ArticleStatus.DRAFT,
    })
    status: ArticleStatus

    @OneToMany(() => ReadingHistory, (history) => history.article)
    readingHistories: ReadingHistory[]

    @OneToMany(() => Comment, (comment) => comment.article)
    comments: Comment[]

    @OneToMany(() => Like, (like) => like.article)
    likes: Like[]

    @OneToMany(() => Bookmark, (bookmark) => bookmark.article)
    bookmarks: Bookmark[]

    @ManyToMany(() => Category, (category) => category.articles)
    @JoinTable()
    categories: Category[]

    @Column({
        type: 'text',
        nullable: true,
    })
    rejectionReason: string | null

    @ManyToOne(() => User, {nullable: true})
    reviewedBy: User | null

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    reviewedAt: Date | null

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    publishedAt: Date | null

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
