import { IsDecimal, IsNotEmpty, IsUUID } from 'class-validator';

// #  dto for the  car object
export class CarDto {
  @IsNotEmpty()
  @IsUUID()
  carCategoryId!: string;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '12' })
  price!: string;
}
