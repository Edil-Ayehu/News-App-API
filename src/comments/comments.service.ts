import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Article)
        private readonly articleRep: Repository<Article>
    ) {}


    async create(userId: string, articleId: string, content: string) {
        const user = await this.userRepo.findOne({
            where: {id: userId}
        });

        if (!user) throw new NotFoundException('User not found');

        const article = await this.articleRep.findOne({
            where: {id: articleId}
        });

        if (!article) throw new NotFoundException("Article not found.")

        const comment = await this.commentRepo.create({
            content,
            user,
            article,
        });

        return this.commentRepo.save(comment);
     }

     async findArticleComments(articleId: string) {
        const comments = await this.commentRepo.find({
            where: {article: {id: articleId}},
            relations: ['user'],
            order: { createdAt: 'DESC'}
        });

        return comments;
     }
}
