import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  link: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
