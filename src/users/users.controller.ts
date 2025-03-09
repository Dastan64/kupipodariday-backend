import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from '../shared/types/interfaces';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getCurrentUser(@Req() req: RequestWithUser) {
    return await this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async editCurrentUser(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getProfileWishes(@Req() req: RequestWithUser) {
    return await this.usersService.findWishes({ id: req.user.id });
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string): Promise<User> {
    return await this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  async getWishesByUsername(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    return await this.usersService.findWishes({ username });
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
