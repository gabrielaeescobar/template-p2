import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Character } from 'src/characters/entities/character.entity';
import { ApiTokenGuard } from 'src/guards/api-token/api-token.guard';
import { Token } from 'src/tokens/entities/token.entity';
import { TokensService } from 'src/tokens/tokens.service';

@Module({
  controllers: [LocationController],
  providers: [LocationService, ApiTokenGuard, TokensService],
  imports: [TypeOrmModule.forFeature([Location, Character, Token, ApiTokenGuard])],
})
export class LocationModule {}
