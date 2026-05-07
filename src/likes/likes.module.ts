import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, User, Article])],
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule {}
