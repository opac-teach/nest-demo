import { Controller, Post, Body, Request, UseGuards} from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-authentification.guard';

@ApiTags('authentification')
@Controller('authentification')

export class AuthentificationController {

    constructor(private AuthentificationService: AuthentificationService){
        console.log('AuthentificationService initialized'); 
    }


    //@HttpCode(HttpStatus .OK)

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
      return this.AuthentificationService.register(createUserDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'User login'})
    @ApiResponse({ status: 201, description: 'Returns the access token' })
    @ApiBody({
        schema: {
        properties: {
            username: { type: 'string' },
            password: { type: 'string' },
        },
        },
    })


    async login(@Request() req) {
      
        return this.AuthentificationService.login(req.user);
        
    }


}
