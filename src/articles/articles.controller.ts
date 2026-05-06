import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
    constructor(
        private articlesService: ArticlesService
    ) {}


    @Post("create")
    async create(
        @Body() dto: CreateArticleDto,
        @GetUser() user,
    ) {
        return await this.articlesService.create(user.sub, dto);
    }


    @Get("findAll")
    async findAll() {
        return await this.articlesService.findAll()
    }
}
