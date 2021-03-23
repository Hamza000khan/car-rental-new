import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

// client dto for validating requests data obj
export class ClientDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
