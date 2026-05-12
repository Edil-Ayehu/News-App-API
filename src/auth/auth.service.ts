import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,

        private jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto) {
        const exists =  await this.userRepo.findOne({
            where: {email: registerDto.email},
        });

        if (exists) throw new BadRequestException("Email already exists")

        const hashedPassword = await bcrypt.hash(registerDto.password, 10)

        const user = this.userRepo.create({
            ...registerDto,
            password: hashedPassword,
        });

        await this.userRepo.save(user);

        return {
            user,
            message: "User registered successfully!"
        }
    }

    async login(loginDto: LoginDto) {
        const user = await this.userRepo.findOne({where: {email: loginDto.email}});

        if(!user) throw new UnauthorizedException("Invalid login credentials")

        const isMatch = await bcrypt.compare(loginDto.password, user.password)

        if(!isMatch) throw new UnauthorizedException("Invalid login credentials")

        const accessToken = this.jwtService.sign(
            {
                sub: user.id, 
                email: user.email,
                role: user.role,
            },
            {expiresIn: '15m'}
        );

        const refreshToken = this.jwtService.sign(
            {sub: user.id},
            {expiresIn: '7d'}
        );

        user.refreshToken = refreshToken;

        await this.userRepo.save(user)

        return {
            accessToken,
            refreshToken,
            user,
        }
    }

    async forgotPassword(forgotPassworDto: ForgotPasswordDto) {
        const user = await this.userRepo.findOne({
            where: {email: forgotPassworDto.email}
        });

        if(!user) throw new BadRequestException("User not found");

        const otp = Math.floor(100000 + Math.random() * 900000).toString();


        user.resetOtp = otp;
        user.resetOtpExpires = new Date(Date.now() + 5 * 60 * 1000);


        await this.userRepo.save(user);

        return {
            message: 'OTP sent successfully',
            otp,
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const user = await this.userRepo.findOne({
            where: {
                resetOtp: resetPasswordDto.otp,
                email: resetPasswordDto.email,
            }
        });

        if (
            !user || 
            !user.resetOtpExpires || 
            user.resetOtpExpires < new Date()
        ) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
        user.resetOtp = null,
        user.resetOtpExpires = null

        await this.userRepo.save(user)

        return {
            message: 'Password reset successful!',

        }
    }
}
