import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, User, Category]),
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
