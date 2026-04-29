import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return await this.authService.register(registerDto)
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto)
    }

    @UseGuards(JwtAuthGuard)
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return await this.authService.forgotPassword(forgotPasswordDto)
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.authService.resetPassword(resetPasswordDto)
    }
}
