import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/articles/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookmark, User, Article])
  ],
  controllers: [BookmarksController],
  providers: [BookmarksService]
})
export class BookmarksModule {}
