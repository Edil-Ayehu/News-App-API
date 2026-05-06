import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import { User } from 'src/user/entities/user.entity';
import slugify from 'slugify'

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private articleRepo: Repository<Article>,

        @InjectRepository(User)
        private userRepo: Repository<User>
    ) {}

    async create(userId: string, dto: CreateArticleDto) {
        const author = await this.userRepo.findOne({
            where: {id: userId}
        });

        if (!author) throw new NotFoundException("User not found");

        const slug = slugify(dto.title, { lower: true, strict: true});

        const article = await this.articleRepo.create({
            ...dto,
            slug,
            author,
        })


        return await this.articleRepo.save(article);
    }

    async findAll() {
        return await this.articleRepo.find({
            relations: ['author'],
            order: { createdAt: 'DESC'},
        });
    }

    async findOne(slug: string) {
        // instead of exposing IDs, using slug is much easier for users to read, share, and remember
        // and also better for search engine optimization : Search engines like Google prefer meaningful URLs
        const article = await this.articleRepo.findOne({
            where: {slug: slug},
            relations: ['author'],
        });

        if (!article) throw new NotFoundException("Article Not Found");

        article.viewsCount += 1;

        await this.articleRepo.save(article);


        return article;
    }

    async remove(userId: string, articleId: string) {
        const article = await this.articleRepo.findOne({
            where: {id: articleId},
            relations: ['author'],
        });

        if (!article) throw new NotFoundException("Article not foud");

        if (article.author.id !== userId) {
            throw new ForbiddenException("Not allowed");
        }

        await this.articleRepo.remove(article);

        return {
            message: "Article deleted successfully",
        }
    }

    async update(userId: string, articleId: string, dto: any) {
        const article = await this.articleRepo.findOne({
            where: {id: articleId},
            relations: ['author'],
        });

        if (!article) throw new NotFoundException("Article not found");

        if (article.author.id !== userId) {
            throw new ForbiddenException("Not allowed");
        }

        if (dto.title) {
            dto.slug = slugify(dto.title, {lower: true, strict: true});
        }

        Object.assign(article, dto)

        return await this.articleRepo.save(article);
    }

    async trendingArticles() {
        return await this.articleRepo.find({
            order: {viewsCount: 'DESC'},
            take: 10,
            relations: ['author'],
        });
    }

    async latestArticles() {
        return await this.articleRepo.find({
            order: {createdAt: 'DESC'},
            take: 10,
            relations: ['author']
        });
    }

    async featuredArticles () {
        return await this.articleRepo.find({
            where: {isFeatured: true},
            order: {createdAt: 'DESC'},
            take: 10,
            relations: ['author'],
        })
    } 
    
}
