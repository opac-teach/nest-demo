import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ConnecService } from './connec.service';
import { CreateuserDto } from '@/user/dtos/user-input.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto} from './dto/connec-imput.dto'

@ApiTags('connexion')

@Controller('connexion')
export class ConnecController {
  constructor(private connecService: ConnecService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.connecService.signIn(signInDto.email, signInDto.password);
  }

  @Post('register')
  register(@Body() registerDto: CreateuserDto) {
    return this.connecService.register(registerDto);
  }
}
