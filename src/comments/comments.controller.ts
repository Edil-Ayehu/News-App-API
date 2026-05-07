import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService
    ) {}

    @Post("create/:articleId")
    async createComment(
        @GetUser() user,
        @Param("articleId") articleId: string,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        return await this.commentsService.create(
            user.sub,
            articleId,
            createCommentDto.content,
        );
    }

    @Get("find-comments/:articleId")
    async findArticleComments(@Param('articleId') articleId: string) {
        return await this.commentsService.findArticleComments(articleId)
    }
}
