import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dtos/login.dto';

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
            {sub: user.id, email: user.email},
            {expiresIn: '1d'}
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
}
