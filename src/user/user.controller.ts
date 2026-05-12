import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from './decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { Role } from './enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@GetUser() user) {
       return await this.userService.getProfile(user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('updateProfile')
    async updateProfile(
        @GetUser() user, 
        @Body() dto: UpdateProfileDto,
    ) {
        return await this.userService.updateProfile(user.sub, dto)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Patch('updateRole/:userId')
    async updateRole(
        @Param('userId') userId: string,
        @Body() dto: UpdateRoleDto,
    ) {
        return this.userService.updateRole(userId, dto.role)
    }
}
