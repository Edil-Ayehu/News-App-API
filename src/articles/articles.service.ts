import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dtos/create-article.dto';
import { User } from 'src/user/entities/user.entity';
import slugify from 'slugify'
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { QueryArticleDto } from './dtos/query-article.dto';
import { Category } from 'src/categories/entities/category.entity';
import { generateUniqueSlug } from 'src/common/utils/generate-slug';
import { Role } from 'src/user/enums/role.enum';
import { ArticleStatus } from './enums/article-status.enum';
import { calculateReadingTime } from 'src/common/utils/calculate-reading-time';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private articleRepo: Repository<Article>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(Category)
        private categoryRepo: Repository<Category>
    ) {}

    async create(currentUser: any, dto: CreateArticleDto) {
        const author = await this.userRepo.findOne({
            where: {id: currentUser.sub}
        });

        if (!author) throw new NotFoundException("User not found");

        const categories = dto.categoryIds?.length ? 
                await this.categoryRepo.findByIds(dto.categoryIds) 
                : [];

        // const slug = slugify(dto.title, { lower: true, strict: true});
        const slug = await generateUniqueSlug(dto.title, this.articleRepo)

        const readingTime = calculateReadingTime(dto.content)

        let status = dto.status || ArticleStatus.DRAFT

        // author can't directly publish article
        if (currentUser.role === Role.AUTHOR && status === ArticleStatus.PUBLISHED) {
            status = ArticleStatus.PENDING_REVIEW
        }

        let publishedAt : Date | null = null

        if (status === ArticleStatus.PUBLISHED) {
             publishedAt = new Date()
        }


        const article = await this.articleRepo.create({
            ...dto,
            slug,
            author,
            categories,
            status,
            readingTime,
            publishedAt,
        });


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

    async remove(currentUser: any, articleId: string) {
        const article = await this.articleRepo.findOne({
            where: {id: articleId},
            relations: ['author'],
        });

        if (!article) throw new NotFoundException("Article not foud");

        const isOwner = currentUser.sub === article.author.id
        const isAdmin = currentUser.role === Role.ADMIN

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("Not allowed");
        }

        await this.articleRepo.remove(article);

        return {
            message: "Article deleted successfully",
        }
    }

    async update(currentUser: any, articleId: string, dto: any) {
        const article = await this.articleRepo.findOne({
            where: {id: articleId},
            relations: ['author'],
        });

        if (!article) throw new NotFoundException("Article not found");

        const isOwner = currentUser.sub === article.author.id
        const isAdmin = currentUser.role === Role.ADMIN

        if (!isAdmin && !isOwner) {
            throw new ForbiddenException("Not allowed")
        }

        if (dto.content) {
            article.readingTime = calculateReadingTime(article.content)
        }

        if (dto.title) {
            dto.slug = slugify(dto.title, {lower: true, strict: true});
        }

        if (dto.status === ArticleStatus.PUBLISHED && article.status !== ArticleStatus.PUBLISHED) {
            article.publishedAt = new Date()
        }

        if (dto.status === ArticleStatus.ARCHIVED) {
            article.publishedAt = null
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

    async pendingReviewArticles(paginationDto: PaginationDto) {
        const { page, limit} = paginationDto

        // const user = await this.userRepo.findOne({
        //     where: {id: userId}
        // });

        // if (!user) throw new BadRequestException("User not found");

        // const isAdmin = user.role === Role.ADMIN

        // if (!isAdmin) throw new ForbiddenException("Only Admin can view pending articles.")

        const [data, total] = await this.articleRepo.findAndCount({
            where: {status: ArticleStatus.PENDING_REVIEW},
            relations: ['author', 'categories'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC'},
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }

    async approveArticle(articleId: string) {
        const article = await this.articleRepo.findOne({
            where: {id: articleId}
        });

        if (!article) throw new NotFoundException("Article not found");

        if (article.status !== ArticleStatus.PENDING_REVIEW) {
            throw new ForbiddenException("Only pending review articles can be approved")
        }

        // status updated to PUblished
        article.status = ArticleStatus.PUBLISHED;

        // published time also updated
        article.publishedAt = new Date()

        await this.articleRepo.save(article)

        return {
            message: "Article approved successfully",
            article,
        }
    }

    async rejectArticle(articleId: string) {
        const article = await this.articleRepo.findOne({
            where: {id: articleId}
        });

        if (!article) throw new NotFoundException("Article not found")

        if (article.status !== ArticleStatus.PENDING_REVIEW) {
            throw new ForbiddenException("Only pending review articles can be rejected");
        }

        // status updated to rejected
        article.status = ArticleStatus.REJECTED

        await this.articleRepo.save(article)

        return {
            message: "Article rejected successfully",
            article,
        }
    }
    
}
