import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { DECORATORKEYENUM } from '../constants/key';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const requireLoginFlag = this.reflector.getAllAndOverride(
      DECORATORKEYENUM.REQUIRE_LOGIN,
      [context.getClass(), context.getHandler()],
    );

    if (!requireLoginFlag) return true;

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('请先登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);

      request.user = data;

      return true;
    } catch (e) {
      throw new UnauthorizedException('token已失效，请先登录');
    }
  }
}
