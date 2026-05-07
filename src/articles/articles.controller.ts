import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
    async findAll(@Query() paginationDto: PaginationDto) {

        return await this.articlesService.findAll(paginationDto)
    }

    @Get('slug/:slug')
    async findOne(@Param('slug') slug: string) {
        return await this.articlesService.findOne(slug)
    }

    @Delete(":id")
    async remove(
        @GetUser() user,
        @Param('id') articleId: string
    ) {
        return await this.articlesService.remove(user.sub, articleId)
    }

    @Patch(":id")
    async update(
        @GetUser() user,
        @Param('id') articleId,
        @Body() dto: UpdateArticleDto,
    ) {
        return await this.articlesService.update(user.sub, articleId, dto);
    }

    @Get("trending-articles")
    async trendingArticles(@Query() paginationDto: PaginationDto) {
        return await this.articlesService.trendingArticles(paginationDto)
    }

    @Get("latest-articles")
    async latestArticles(@Query() paginationDto: PaginationDto) {
        return await this.articlesService.latestArticles(paginationDto)
    }

    @Get("featured-articles")
    async featuredArticles(@Query() paginationDto: PaginationDto) {
        return await this.articlesService.featuredArticles(paginationDto)
    }
}
