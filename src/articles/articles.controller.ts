import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dtos/create-article.dto';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateArticleDto } from './dtos/update-article.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { QueryArticleDto } from './dtos/query-article.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/user/enums/role.enum';
import { RejectArticleDto } from './dtos/reject-article.dto';

@Controller('articles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticlesController {
    constructor(
        private articlesService: ArticlesService
    ) {}


    @Post("create")
    @Roles(Role.ADMIN, Role.AUTHOR)
    async create(
        @Body() dto: CreateArticleDto,
        @GetUser() user,
    ) {
        return await this.articlesService.create(user, dto);
    }


    @Get("findAll")
    async findAll(@Query() queryDto: QueryArticleDto) {

        return await this.articlesService.findAll(queryDto)
    }

    @Get('slug/:slug')
    async findOne(@Param('slug') slug: string) {
        return await this.articlesService.findOne(slug)
    }

    @Delete(":id")
    @Roles(Role.ADMIN, Role.AUTHOR)
    async remove(
        @GetUser() user,
        @Param('id') articleId: string
    ) {
        return await this.articlesService.remove(user, articleId)
    }

    @Patch(":id")
    @Roles(Role.ADMIN, Role.AUTHOR)
    async update(
        @GetUser() user,
        @Param('id') articleId,
        @Body() dto: UpdateArticleDto,
    ) {
        return await this.articlesService.update(user, articleId, dto);
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

    @Get('fetch-pending-review-articles')
    @Roles(Role.ADMIN)
    async fetchPendingReviewArticles(
        @Query() dto: PaginationDto,
    ) {
        return await this.articlesService.fetchPendingReviewArticles(dto)
    }

    @Get('fetch-published-articles')
    async fetchPublishedArticles (
        @Query() dto: PaginationDto,
    ) {
        return await this.articlesService.fetchPublishedArticles(dto)
    }

    @Get('fetch-rejected-articles')
    @Roles(Role.ADMIN)
    async fetchRejectedArticles (
        @Query() dto: PaginationDto,
    ) {
        return await this.articlesService.fetchRejectedArticles(dto)
    }

    @Patch("approve-article/:articleId")
    @Roles(Role.ADMIN)
    async approveArticle(
        @Param('articleId') articleId: string,
    ) {
        return await this.articlesService.approveArticle(articleId)
    }

    @Patch("reject-article/:articleId")
    @Roles(Role.ADMIN)
    async rejectArticle(
        @Param('articleId') articleId: string,
        @Body() dto: RejectArticleDto,
        @GetUser() user,
    ) {
        return await this.articlesService.rejectArticle(
            articleId, 
            user.sub, 
            dto.rejectionReason,
        );
    }
}
