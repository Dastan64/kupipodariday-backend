import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: user,
    });

    // TODO: добавить сохранение items

    const savedWishlist = await this.wishlistsRepository.save(wishlist);

    return this.findOne({
      where: { id: savedWishlist.id },
      relations: ['owner', 'items'],
    });
  }

  async findWishlistById(id: number): Promise<Wishlist> {
    return await this.findOne({ where: { id }, relations: ['owner', 'items'] });
  }

  async findOne(options: FindOneOptions<Wishlist>): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne(options);

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    return wishlist;
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
      order: { id: 'ASC' },
    });
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    await this.findOne({ where: { id } });

    await this.wishlistsRepository.update(id, updateWishlistDto);

    return await this.findOne({ where: { id } });
  }

  async removeOne(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете удалить чужой вишлист');
    }

    await this.wishlistsRepository.remove(wishlist);

    return wishlist;
  }
}
