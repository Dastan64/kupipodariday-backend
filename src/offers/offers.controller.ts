import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RequestWithUser } from '../shared/types/interfaces';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post('/')
  async create(
    @Req() req: RequestWithUser,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return await this.offersService.create(createOfferDto, req.user.id);
  }

  @Get('/')
  async getAllOffers(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  async getOfferById(@Param('id') id: number) {
    return this.offersService.findOfferById(id);
  }
}
