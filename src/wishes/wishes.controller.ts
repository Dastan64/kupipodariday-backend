import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Wish } from './entities/wish.entity';
import { RequestWithUser } from '../shared/types/interfaces';
import { UpdateWishDto } from './dto/update-wish.dto';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post('/')
  async create(
    @Req() req: RequestWithUser,
    @Body() createWishDto: CreateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.create(createWishDto, req.user);
  }

  @Get('/last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.getLastWishes();
  }

  @Get('/top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.getTopWishes();
  }

  @Get(':id')
  async getWishById(@Param('id') id: number): Promise<Wish> {
    return await this.wishesService.findWishById(id);
  }

  @Patch(':id')
  async updateWithById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return await this.wishesService.updateWishWithChecks(
      id,
      updateWishDto,
      req.user,
    );
  }

  @Delete(':id')
  async deleteWishById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<Wish> {
    return await this.wishesService.removeWishWithChecks(id, req.user);
  }

  @Post(':id/copy')
  async copyWishById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<Wish> {
    return await this.wishesService.copyWish(id, req.user);
  }
}
