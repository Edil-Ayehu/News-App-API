import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>
    ) {}

    async create(name: string) {
        const existing = await this.categoryRepo.findOne({
            where: {name}
        });

        if (existing) throw new BadRequestException("Category already exists")

        const category = this.categoryRepo.create({name})

        await this.categoryRepo.save(category);

        return {
            message: "Category created successfully!",
            category,
        }
    }

    async findAll(paginationDto: PaginationDto) {
        const {page, limit} = paginationDto

        const [data, total] = await this.categoryRepo.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {createdAt: 'DESC'}
        })
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }

    async update(id: string, name: string) {
        const category = await this.categoryRepo.findOne({
            where: {id}
        });

        if (!category) throw new NotFoundException("Category not found");

        category.name = name;

        await this.categoryRepo.save(category);

        return {
            message: "Category updated successfully!",
            category,
        }
    }

    async remove(id: string) {
        const category = await this.categoryRepo.findOne({
            where: {id}
        });

        if (!category) throw new NotFoundException("Category not found");

        await this.categoryRepo.remove(category)

        return {
            message: "Category deleted successfully!",
            id,
        }
    }

}
