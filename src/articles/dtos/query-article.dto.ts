import { Type } from "class-transformer"
import { IsOptional, IsPositive, IsString, Min } from "class-validator"

export class QueryArticleDto {
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    page: number = 1

    @IsOptional()
    @Min(1)
    @Type(() => Number)
    limit: number = 10

    @IsOptional()
    @IsString()
    search?:string

    @IsOptional()
    @IsString()
    author?:string
}