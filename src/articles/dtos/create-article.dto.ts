import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator"

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
}