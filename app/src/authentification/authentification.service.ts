import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthentificationService {

    constructor(private userService: UsersService, private jwtService: JwtService){}

    async register(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.userService.create({
          ...createUserDto,
          password: hashedPassword,
        });
        return user;
      }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        //console.log('correct user')
        if (!user) {
            console.log('User not found');
            throw new UnauthorizedException('User not found');
        }
        const userPassword = user.password; // Mot de passe haché dans la base de données
        const enteredPassword = pass; // Mot de passe saisi par l'utilisateur

        
        
        const match = await bcrypt.compare(enteredPassword, userPassword);
        console.log('Password match:', match); // Devrait retourner `true` si les mots de passe correspondent


        if (user && !(await bcrypt.compare(pass, user.password))) {
            console.log('Invalid password');
            throw new UnauthorizedException('Invalid password');
        }
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            console.log('correct password')
            return result;
        }
        return null;
        }

    async login(user : any) {

        const payload = { sub: user.id, username: user.username };
        return {
        access_token: this.jwtService.sign(payload),
        };
    }


      async logout() {
        
        return { message: 'Logged out' };
      }
        
    }



