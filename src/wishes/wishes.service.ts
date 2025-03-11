import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });

    const savedWish = await this.wishesRepository.save(wish);

    return this.findOne({ where: { id: savedWish.id }, relations: ['owner'] });
  }

  async findOne(options: FindOneOptions<Wish>) {
    const wish = await this.wishesRepository.findOne(options);

    if (!wish) {
      throw new NotFoundException();
    }

    return wish;
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { createdAt: 'asc' },
      take: 40,
      relations: {
        owner: true,
        offers: false,
      },
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { copied: 'desc' },
      take: 20,
      relations: {
        owner: true,
        offers: false,
      },
    });
  }

  async findWishById(id: number): Promise<Wish> {
    return await this.findOne({ where: { id }, relations: ['owner'] });
  }

  async updateWishWithChecks(
    id: number,
    updateWishDto: UpdateWishDto,
    user: User,
  ): Promise<Wish> {
    const wish = await this.findOne({ where: { id } });

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете редактировать чужой подарок');
    }

    if (wish.offers.length > 0 && updateWishDto.price) {
      throw new BadRequestException('Нельзя обновить цену при наличии заявок');
    }

    return await this.updateOne(id, updateWishDto);
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    await this.wishesRepository.update(id, updateWishDto);

    return await this.findOne({ where: { id } });
  }

  async removeWishWithChecks(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете удалить чужой подарок');
    }

    return this.removeOne(wish);
  }

  async removeOne(wish: Wish): Promise<Wish> {
    await this.wishesRepository.remove(wish);

    return wish;
  }

  async copyWish(id: number, user: User): Promise<Wish> {
    const wish = await this.findOne({ where: { id } });

    const copiedWish = this.wishesRepository.create({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: user,
      raised: 0,
      copied: 0,
    });

    wish.copied += 1;

    await this.wishesRepository.save(wish);

    return await this.wishesRepository.save(copiedWish);
  }
}
