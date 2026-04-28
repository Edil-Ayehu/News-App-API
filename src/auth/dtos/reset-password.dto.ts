import { IsNotEmpty, MinLength } from "class-validator"

export class ResetPassword {
    @IsNotEmpty()
    token: string

    @MinLength(6)
    newPassword: string
}