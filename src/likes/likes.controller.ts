import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { GetUser } from 'src/user/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
    constructor (
        private readonly likesService: LikesService
    ) {}

    @Post('toggle/:articleId')
    async toggle(
        @GetUser() user,
        @Param('articleId') articleId: string
    ) {
        return await this.likesService.toggle(user.sub, articleId);
    }
}
