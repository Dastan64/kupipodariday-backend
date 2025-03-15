import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseError } from 'pg';

import { FindOneOptions, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../hash/hash.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;

    try {
      const hashedPassword = await this.hashService.hash(password);

      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return await this.usersRepository.save(user);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const pgError = error.driverError as DatabaseError;
        if (pgError.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или ником уже существует',
          );
        }
      }
      throw error;
    }
  }

  async findMany(query: string): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async findById(id: number): Promise<User> {
    return await this.findOne({ where: { id } });
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    const user = await this.usersRepository.findOne(options);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return await this.findOne({
      where: { username },
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne({ where: { id } });

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.hash(
        updateUserDto.password,
      );
    }

    await this.usersRepository.update(id, updateUserDto);

    return await this.findOne({ where: { id } });
  }

  async findWishes(query: { id?: number; username?: string }): Promise<Wish[]> {
    const user = await this.findOne({
      where: query,
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });

    return user.wishes || [];
  }
}
