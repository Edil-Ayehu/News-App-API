import { Injectable, NotFoundException } from '@nestjs/common';
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
    
}
