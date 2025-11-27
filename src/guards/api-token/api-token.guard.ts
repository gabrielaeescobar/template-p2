// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { Observable } from 'rxjs';

// @Injectable()
// export class ApiTokenGuard implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     return true;
//   }
// }

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from 'src/tokens/entities/token.entity';
import { Request } from 'express';

@Injectable()
export class ApiTokenGuard implements CanActivate {

  constructor(
    @InjectRepository(Token)
    private readonly keyRepository: Repository<Token>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const apiToken = request.headers['api-token'] as string | undefined;

    if (!apiToken) {
      throw new UnauthorizedException('Missing api-token header');
    }

    const key = await this.keyRepository.findOne({
      where: { token: apiToken, active: true }
    });

    if (!key) {
      throw new UnauthorizedException('Invalid API token');
    }

    if (key.reqLeft <= 0) {
      throw new ForbiddenException('API token has no requests left');
    }

    key.reqLeft -= 1;
    await this.keyRepository.save(key);

    return true;
  }
}
