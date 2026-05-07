import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Article])
  ],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
