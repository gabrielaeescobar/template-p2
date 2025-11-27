import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { Character } from './entities/character.entity';
import { Location } from 'src/location/entities/location.entity';
import { Token } from 'src/tokens/entities/token.entity';
import { ApiTokenGuard } from 'src/guards/api-token/api-token.guard';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([Character, Location, Token]), TokensModule],
  controllers: [CharactersController],
  providers: [CharactersService, ApiTokenGuard],
})
export class CharactersModule {}
