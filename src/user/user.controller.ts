import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from './decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @Get('profile')
    async getProfile(@GetUser() user) {
       return await this.userService.getProfile(user.sub);
    }
}
