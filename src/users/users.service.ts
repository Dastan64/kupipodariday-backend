import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким email или ником уже существует',
      );
    }

    await bcrypt.hash(password, 10).then((hash) => {
      const user = this.usersRepository.create({
        ...createUserDto,
        password: hash,
      });

      return this.usersRepository.save(user);
    });
  }

  async findByUsername(username: string) {
    return await this.usersRepository.findOne({ where: { username } });
  }
}
