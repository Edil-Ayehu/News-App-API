import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator"
import { ArticleStatus } from "../enums/article-status.enum"
import { Transform } from "class-transformer"

export class CreateArticleDto {
    @IsString({message: "Title need to be string"})
    title: string

    @IsString()
    summary: string

    @IsString()
    content: string

    @IsOptional()
    imageUrl?: string

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean

    @IsOptional()
    @IsArray()
    categoryIds?: string[]

    @IsOptional()
    @Transform(({value}) => 
        typeof value === 'string' ? value.toUpperCase() : value
    )
    @IsEnum(ArticleStatus, {message: "Invalid article status"})
    status?: ArticleStatus
}
