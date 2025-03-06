import { Column, Entity, ManyToOne } from 'typeorm';
import { IsPositive } from 'class-validator';

import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntity } from '../../shared/base.entity';

@Entity()
export class Offer extends BaseEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsPositive()
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
