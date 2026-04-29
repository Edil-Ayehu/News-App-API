import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from './decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dtos/update-profile.dto';

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

    @Patch('updateProfile')
    async updateProfile(
        @GetUser() user, 
        @Body() dto: UpdateProfileDto,
    ) {
        return await this.userService.updateProfile(user.sub, dto)
    }
}
