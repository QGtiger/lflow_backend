import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { PostgresService } from '../postgres/postgres.service';
import { User } from './entities/user.entity';
import { md5 } from '../utils';
import { JwtService } from '@nestjs/jwt';
import { LoginUserVo } from './vo/login-user.vo';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
  @Inject(PostgresService)
  private postgresService: PostgresService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(RedisService)
  private redisService: RedisService;

  getJwtPayloadByUser(user: User): JwtUserData {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  /**
   * 查询用户
   * @param id 用户 id
   * @returns 用户
   */
  async findUserById(id: number): Promise<User> {
    return this.postgresService.findOne('users', {
      id,
    });
  }

  // 生成 JWT Token
  generateJwtToken(user: User) {
    const payload = this.getJwtPayloadByUser(user);
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME,
      }),
      refreshToken: this.jwtService.sign(
        {
          userId: payload.id,
        },
        {
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME,
        },
      ),
    };
  }

  /**
   * 用户登录
   * @param loginUserDto 用户登录信息
   * @returns loginUserVo 登录成功后返回的信息
   */
  async login(loginUserDto: LoginUserDto) {
    const foundUser: User = await this.postgresService.findOne('users', {
      username: loginUserDto.username,
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误，请重试', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
    vo.userInfo = this.getJwtPayloadByUser(foundUser);

    const tokenConfig = this.generateJwtToken(foundUser);

    vo.accessToken = tokenConfig.accessToken;
    vo.refreshToken = tokenConfig.refreshToken;

    return vo;
  }

  async register(registerUserDto: RegisterUserDto) {
    const captcha = await this.redisService.get(
      `captcha_${registerUserDto.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已过期，请重试', HttpStatus.BAD_REQUEST);
    }

    if (captcha !== registerUserDto.captcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const emailUser = await this.postgresService.findOne('users', {
      email: registerUserDto.email,
    });

    const foundUser = await this.postgresService.findOne('users', {
      username: registerUserDto.username,
    });

    if (emailUser) {
      throw new HttpException('邮件已注册', HttpStatus.BAD_REQUEST);
    }

    if (foundUser) {
      throw new HttpException('用户名已注册', HttpStatus.BAD_REQUEST);
    }

    await this.postgresService.create<Partial<User>>('users', {
      username: registerUserDto.username,
      email: registerUserDto.email,
      // 密码加密
      password: md5(registerUserDto.password),
    });
    return await this.login(registerUserDto);
  }
}
