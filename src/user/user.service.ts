import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) {}

    async getProfile(userId:string) {
        const user = this.userRepo.findOne({
            where: {id: userId},
            relations: ['following']
        });

        if (!user) throw new NotFoundException("User not found")

        return user
    }
}
