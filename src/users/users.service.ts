import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
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

    const hashedPassword = await this.hashService.hash(password);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findMany(query: string): Promise<User[] | null> {
    return await this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Пользователь с таким id не найден');
    }

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { username },
    });
  }
}
