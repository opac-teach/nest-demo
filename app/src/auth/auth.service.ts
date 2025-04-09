import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { compare } from 'bcryptjs';
import { AuthBodyDto } from '@/auth/dtos/authBodyDto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(private readonly userService: UsersService, private readonly jwtService : JwtService) {
    }

    async login(authBody: AuthBodyDto ){

        const { username, password } = authBody;
        // on récupere l'utilisateur depuis le userService
        const user = await this.userService.getUser(username);

        if (!user) {
            throw new NotFoundException({ error: "Mot de passe ou nom d'utilisateur incorrect" });
        }
        const isValidPassword = await this.isValidPassword(password, user.password);

        if(!isValidPassword) {
            throw new NotFoundException({ error: "Mot de passe ou nom d'utilisateur incorrect" });
        }

        return this.authenticateUser({userId: user.userId})

    }

    // crypter le token de l'utilisateur
    private async isValidPassword(password: string, hashPassword: string): Promise<boolean> {
        return await compare(password, hashPassword);
    }

    // Fonction qui gère l'authentification
    private async authenticateUser({userId} : {userId: number}) {
        const payload = {userId}
        return {access_token:  await this.jwtService.signAsync(payload)}
    }

    async getProfile(username : string){
      const user = await this.userService.getUser(username);
      if(!user){
        throw new NotFoundException("Utilisateur non trouvé")
      }
      return {userId: user.userId, username: user.username};
    }
}
