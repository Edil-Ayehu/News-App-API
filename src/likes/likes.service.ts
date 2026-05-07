import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like) 
        private readonly likeRepo: Repository<Like>,
        
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Article)
        private readonly articleRep: Repository<Article>
    ) {}

    async toggle(userId: string, articleId) {
        const existingLike = await this.likeRepo.findOne({
            where: {
                user: {id: userId}, 
                article: {id: articleId},
            },
            relations: ['user', 'article']
        });

        if (existingLike) {
            await this.likeRepo.remove(existingLike);

            return {
                message: "Article unliked",
            }
        }

        const user = await this.userRepo.findOne({
            where: {id: userId},
        });

        if (!user) throw new UnauthorizedException("Invalid or expired token!");

        const article = await this.articleRep.findOne({
            where: {id: articleId}
        });

        if (!article) throw new BadRequestException("Article not found");

        const like = this.likeRepo.create({
            user,
            article,
        })

        await this.likeRepo.save(like);

        return {
            message: "Article liked",
        }
    }
}
