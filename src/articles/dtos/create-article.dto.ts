import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator"
import { ArticleStatus } from "../enums/article-status.enum"

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
    @IsEnum(ArticleStatus)
    status?: ArticleStatus
}