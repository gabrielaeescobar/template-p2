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

  async findOne(id: number) {
    try {
      const token = await this.tokenRepository.findOneBy({id: String(id)});
      if (!token) {
        throw new Error('Key not found');
      }
      else if (token.reqLeft <= 0) {
        throw new Error('Key has no requests left');
      }
      return token;
    }
    catch(error) {
      if (error.message === 'Key not found') throw error;
      this.handleDBExceptions(error)
    }
  }

  async patch(id: string) {
    try {
      const token = await this.tokenRepository.findOneBy({ id });

      if (!token) {
        throw new Error('Token not found');
      }

      token.reqLeft -= 1;
      await this.tokenRepository.save(token);

      return token;
    } catch (error) {
      if (error.message === 'Token not found') throw error;
      this.handleDBExceptions(error);
    }
  }


  update(id: number, updateTokenDto: UpdateTokenDto) {
    return `This action updates a #${id} token`;
  }

  remove(id: number) {
    return `This action removes a #${id} token`;
  }
}
