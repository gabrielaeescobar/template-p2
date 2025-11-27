import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Character } from 'src/characters/entities/character.entity';
import { Location } from 'src/location/entities/location.entity';


@Injectable()
export class LocationService {

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
  ) {}
  async create(createLocationDto: CreateLocationDto) {
    const { owner, ...data } = createLocationDto;
    const ownerEntity = await this.characterRepository.findOneBy({ id: owner });

    if (!owner || ownerEntity === null) {
      throw new Error('Owner is required');
    }

    const { location } = ownerEntity;
    if (location) {
      throw new Error('Character already owns a location');
    }

    const locationEntity = this.locationRepository.create({ ...data, owner: ownerEntity });
    await this.locationRepository.save(locationEntity);
    return locationEntity;
  }

  async findAll() {
    try {
      const locations = await this.locationRepository.find({ relations: ['owner', 'characters'] });
      return locations;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
