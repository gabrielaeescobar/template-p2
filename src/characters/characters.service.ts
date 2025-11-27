/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Character } from './entities/character.entity';
import { Location } from 'src/location/entities/location.entity';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto) {
    const { name, salary, employee, location, favorites } = createCharacterDto;

    try {
      const character = new Character();
      character.name = name;
      character.salary = salary;
      character.employee = employee;

      if (location) {
        const locationEntity = await this.locationRepository.findOne({
          where: { id: location },
        });
        if (!locationEntity) {
          throw new BadRequestException(`Location with id ${location} not found`);
        }
        character.location = locationEntity.id;
      }

      // character sin favoritos
      const savedCharacter = await this.characterRepository.save(character);

      // guardar los favoritos
      if (favorites && favorites.length > 0) {
        const favoriteLocations = await this.locationRepository.findByIds(favorites);
        if (favoriteLocations.length !== favorites.length) {
          throw new BadRequestException('One or more favorite locations not found');
        }
        savedCharacter.favorites = favoriteLocations;
        return await this.characterRepository.save(savedCharacter);
      }

      return savedCharacter;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  async getFav (characterId: string, locationId: string) {
    try {
      const character = await this.characterRepository.findOne({
        where: { id: characterId },
        relations: ['favorites'],
      });

      if (!character) {
        throw new BadRequestException(`Character with id ${characterId} not found`);
      }

      // buscar location
      const location = await this.locationRepository.findOne({ where: { id: locationId } });
      if (!location) {
        throw new BadRequestException(`Location with id ${locationId} not found`);
      }

      const alreadyFavorite = (character.favorites || []).some(f => f.id === location.id);
      if (alreadyFavorite) {
        return character; // no cambiar nada
      }

      character.favorites = [...(character.favorites || []), location];
      const updated = await this.characterRepository.save(character);
      return updated;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(error.message);
    }
  }


  findOne(id: number) {
    try {
      const character = this.characterRepository.findOneBy({id: String(id)});

      if (!character) {
        throw new Error('Character not found');
      }
      return character;
    }
    catch(error) {
      if (error.message === 'Character not found') throw error;
      throw new BadRequestException(error.message);
    }
  }

  async getTaxes(characterId: string) {
    try {
      const character = await this.characterRepository.findOne({ where: { id: characterId }, relations: ['location'] });
      if (!character) {
        throw new BadRequestException(`Character with id ${characterId} not found`);
      }

      if (!character.location) {
        return { taxDebt: 0 };
      }

      let locationEntity: Location | null = null;
      if (typeof character.location === 'string') {
        locationEntity = await this.locationRepository.findOne({ where: { id: character.location } });
      } else {
        locationEntity = character.location as Location;
      }

      if (!locationEntity) {
        return { taxDebt: 0 };
      }
      let coef = 0;
      if (character.employee){
        coef = 0.08;
      }
      else {
        coef = 0.12;
      }
      const taxDebt = locationEntity.cost * (1 + coef);
      return { taxDebt };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return `This action updates a #${id} character`;
  }

  remove(id: number) {
    return `This action removes a #${id} character`;
  }
  
  findAll() {
    return `This action returns all characters`;
  }
}
