import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TokensService {

  constructor(
  @InjectRepository(Token)
  private readonly tokenRepository: Repository<Token>,

  ){}
  
  private handleDBExceptions(error: any){
      if(error.code === '23505'){
          throw new BadRequestException(error.detail)
        }
      console.log(error);
      throw new InternalServerErrorException('Please check server logs');
    }


  async create(createTokenDto: CreateTokenDto) {
    try{
        const {...data}= createTokenDto;
        const token = this.tokenRepository.create({
          ...data
        });
        await this.tokenRepository.save(token)
        return token;
    }
    catch(error){
      this.handleDBExceptions(error)
    }

  }

  findAll() {
    return `This action returns all tokens`;
  }

  findOne(id: number) {
    try {
      const token = this.tokenRepository.findOneBy({id: String(id)});
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      if (!token) {
        throw new Error('Key not found');
      }
      return token;


    }
    catch(error) {
      if (error.message === 'Key not found') throw error;
      this.handleDBExceptions(error)

    }
    return `This action returns a #${id} key`;  }

  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
