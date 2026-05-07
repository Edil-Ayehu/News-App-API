import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import { User } from 'src/user/entities/user.entity';
import slugify from 'slugify'
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { QueryArticleDto } from './dtos/query-article.dto';

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

    async findAll(queryDto: QueryArticleDto) {
        const { page, limit, search, author} = queryDto

        const query = this.articleRepo
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.author', 'author');

        if (search) {
            query.andWhere(
              `
              LOWER(article.title) LIKE LOWER(:search)
              OR LOWER(article.summary) LIKE LOWER(:search)
              OR LOWER(article.content) LIKE LOWER(:search)
              `,
              {
                search: `%${search}%`,
              }
            )
        }

        if (author) {
            query.andWhere(
                `
                LOWER(author.fullName) LIKE LOWER(:author)
                `,
                {
                    author: `%${author}%`
                }
            )
        }

        query.orderBy('article.createdAt', 'DESC');

        query.skip((page - 1) * limit);
        query.take(limit);

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
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

    async trendingArticles(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto

        const [data, total] = await this.articleRepo.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { viewsCount: 'DESC'},
            relations: ['author']
        });
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }

    async latestArticles(paginationDto: PaginationDto) {
        const { page, limit} = paginationDto

        const [data, total] = await this.articleRepo.findAndCount({
            skip: (page -1) * limit,
            take: limit,
            order: {createdAt: 'DESC'},
            relations: ['author'],
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }

    async featuredArticles (paginationDto: PaginationDto) {
        const {page, limit} = paginationDto

        const [ data, total] = await this.articleRepo.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {createdAt: 'DESC'},
            relations: ['author']
        })

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    } 
    
}
