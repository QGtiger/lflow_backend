import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { DECORATORKEYENUM } from '../constants/key';

export const RequireLogin = () =>
  SetMetadata(DECORATORKEYENUM.REQUIRE_LOGIN, true);

export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(DECORATORKEYENUM.REQUIRE_PERMISSION, permissions);

export const UserInfo = createParamDecorator(
  (data: keyof JwtUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) return null;

    return data ? request.user[data] : request.user;
  },
);
