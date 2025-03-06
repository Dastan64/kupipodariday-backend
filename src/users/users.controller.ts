import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get(':username')
  async get(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('Пользователь с таким ником не найден');
    }

    return user;
  }

  @Post('find')
  async findAll(query: string): Promise<User[]> {
    const users = await this.usersService.findMany(query);

    if (!users || !users.length) {
      throw new NotFoundException('Пользователь с таким ником не найден');
    }

    return users;
  }
}
