import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class BookmarksService {
    constructor(
        @InjectRepository(Bookmark)
        private readonly bookmarkRepo: Repository<Bookmark>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Article)
        private readonly articleRepo: Repository<Article>
    ) {}

    async toggle(userId: string, articleId: string) {
        const existing = await this.bookmarkRepo.findOne({
            where: {
                user: {id: userId},
                article: {id: articleId},
            },
            relations: ['user', 'article'],
        });

        if (existing) {
            await this.bookmarkRepo.remove(existing);

            return {message: "Article removed from bookmark."}
        }

        const user = await this.userRepo.findOne({
            where: {id: userId}
        });

        if (!user) throw new UnauthorizedException("Invalid or expired token!")

        const article = await this.articleRepo.findOne({
            where: {id: articleId}
        });

        if (!article) throw new BadRequestException("Article not found");

        const bookmark = this.bookmarkRepo.create({
            user,
            article,
        });

        await this.bookmarkRepo.save(bookmark);

        return {message: "Article bookmarked!"};
    }

    async myBookmarks(userId: string, paginationDto: PaginationDto) {
        const {page, limit} = paginationDto

        const [data, total] = await this.bookmarkRepo.findAndCount({
            where: {user: {id: userId}},
            skip: (page - 1) * limit,
            take: limit,
            relations: ['article'],
            order: {
                createdAt: 'DESC',
            }
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }
}
