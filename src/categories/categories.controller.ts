import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(
        private categoriesService: CategoriesService
    ) {}

    @Post('create')
    async create(@Body() dto: CreateCategoryDto) {
        return await this.categoriesService.create(dto.name)
    }

    @Get()
    async findAll(@Query() dto: PaginationDto) {
        return await this.categoriesService.findAll(dto)
    }

    @Patch('update/:categoryId')
    async update(
      @Param('categoryId') categoryId: string,
      @Body() dto: UpdateCategoryDto,
    ) {
        return await this.categoriesService.update(categoryId, dto.name!);
    }

    @Delete('delete/:categoryId')
    async remove(
        @Param('categoryId') categoryId: string,
    ) {
        return await this.categoriesService.remove(categoryId)
    }

    @Get("findCategoryArticles/:categoryId")
    async findCategoryArticles(
        @Param('categoryId') categoryId: string,
        @Query() paginationDto: PaginationDto,
    ) {
        return await this.categoriesService.findCategoryArticles(categoryId, paginationDto)
    }
}
