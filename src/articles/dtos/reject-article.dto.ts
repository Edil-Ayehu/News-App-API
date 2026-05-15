import { IsNotEmpty, IsString } from "class-validator";

export class RejectArticleDto {
    @IsString()
    @IsNotEmpty()
    rejectionReason: string
}