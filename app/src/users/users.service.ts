import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from '@/users/users.entity';
import { Repository } from 'typeorm';
import {hash} from 'bcryptjs';
import { CreateUserBodyDto } from '@/users/usersBodyDto';

@Injectable()
export class UsersService {

    constructor (
        @InjectRepository(UsersEntity)
        private readonly userRepository: Repository<UsersEntity>,
    ){}

    async getUser (username: string): Promise<UsersEntity | null> {
        try {
            return await this.userRepository.findOneBy({ ['username']: username });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async findById (userId: number): Promise<UsersEntity | null> {
        try {
            return await this.userRepository.findOneBy({['userId']: userId});
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async createUser(user: CreateUserBodyDto): Promise<string> {
        const userHashedPassword = await this.hashPassword(user.password);
        try {
            await this.userRepository.save({...user, password: userHashedPassword});// créer le user avec un password crypté
            return `Le user ${user.username} enregistré avec succès`;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    private async hashPassword (password: string): Promise<string> {
        return  await hash(password, 10);
    }
}
