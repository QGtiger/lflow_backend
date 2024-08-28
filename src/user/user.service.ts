import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { PostgresService } from '../postgres/postgres.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  @Inject(PostgresService)
  private postgresService: PostgresService;

  async login(loginUserDto: LoginUserDto) {
    const foundUser: User = await this.postgresService.findOne('users', {
      username: loginUserDto.username,
    });
    console.log(foundUser);
    if (!foundUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.password !== loginUserDto.password) {
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    }

    return loginUserDto;
  }

  async register(registerUserDto: RegisterUserDto) {
    const newUser = await this.postgresService.create('users', registerUserDto);
    return newUser;
  }
}
