import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
    constructor(
        private readonly bookmarksService: BookmarksService
    ) {}

    @Post('toggle/:articleId')
    async toggle(
        @GetUser() user,
        @Param('articleId') articleId: string
    ) {
        return await this.bookmarksService.toggle(user.sub, articleId)
    }

    @Get('myBookmarks')
    async myBookmarks(
        @GetUser() user,
        @Query() paginationDto: PaginationDto,
    ) {
        return await this.bookmarksService.myBookmarks(user.sub, paginationDto)
    }
}
