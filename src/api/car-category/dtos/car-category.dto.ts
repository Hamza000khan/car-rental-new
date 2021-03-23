import { IsNotEmpty, IsString, Length } from 'class-validator';

// # car category dto for the data validation
export class CarCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  displayName!: string;
}
