import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

export class ResetPasswordDto {
    @IsNotEmpty()
    otp: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @MinLength(6)
    newPassword: string
}