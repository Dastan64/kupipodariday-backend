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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { RequestWithUser } from '../shared/types/interfaces';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get('/')
  async getAllWishlists(): Promise<Wishlist[]> {
    return await this.wishlistsService.findAll();
  }

  @Post('/')
  async create(
    @Req() req: RequestWithUser,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wishlist> {
    return await this.wishlistsService.findWishlistById(id);
  }

  @Patch(':id')
  async updateWishlistById(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateOne(id, updateWishlistDto);
  }

  @Delete(':id')
  async deleteWishlistById(
    @Req() req: RequestWithUser,
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return await this.wishlistsService.removeOne(id, req.user);
  }
}
