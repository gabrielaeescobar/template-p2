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
import { TokensService } from 'src/tokens/tokens.service';
import { Request } from 'express';

@Injectable()
export class ApiTokenGuard implements CanActivate {

  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly tokensService: TokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const apiToken = request.headers['api-token'] as string | undefined;

    if (!apiToken) {
      throw new UnauthorizedException('Missing api-token header');
    }

    const token = await this.tokenRepository.findOne({
      where: { token: apiToken, active: true }
    });

    if (!token) {
      throw new UnauthorizedException('Invalid API token');
    }

    if (token.reqLeft <= 0) {
      throw new ForbiddenException('API token has no requests left');
    }

    await this.tokensService.patch(token.id);

    return true;
  }
}
