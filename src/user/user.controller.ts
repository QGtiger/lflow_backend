import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Query,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RequireLogin, UserInfo } from '../common/custom.decorator';
import { LoginGuard } from '../common/login.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Get('info')
  @RequireLogin()
  @UseGuards(LoginGuard)
  info(@UserInfo() userInfo: JwtUserData) {
    return userInfo;
  }

  @Get('refreshToken')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    try {
      const payload: {
        userId: number;
      } = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(payload.userId);

      this.userService.generateJwtToken(user);

      return this.userService.generateJwtToken(user);
    } catch (e) {
      throw new UnauthorizedException('refreshToken 无效');
    }
  }
}
