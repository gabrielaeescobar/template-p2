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
        character.location = locationEntity;
      }

      if (favorites && favorites.length > 0) {
        const favoriteLocations = await this.locationRepository.findByIds(favorites);
        if (favoriteLocations.length !== favorites.length) {
          throw new BadRequestException('One or more favorite locations not found');
        }
        character.favorites = favoriteLocations;
      }

      return await this.characterRepository.save(character);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    return `This action returns all characters`;
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

  update(id: number, updateCharacterDto: UpdateCharacterDto) {
    return `This action updates a #${id} character`;
  }

  remove(id: number) {
    return `This action removes a #${id} character`;
  }
}
