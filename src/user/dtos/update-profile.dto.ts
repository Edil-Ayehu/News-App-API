import { IsOptional } from "class-validator"

export class UpdateProfileDto {
    @IsOptional()
    fullName?: string

    @IsOptional()
    bio?: string
}