import {
  IsString,
  IsEmail,
  IsDecimal,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsNumberString,
  IsNotEmptyObject,
  isString,
} from 'class-validator';

/* ---------------------------- Create Portfolio ---------------------------- */
export class CreatePortfolioDto {
  @IsNumberString()
  @IsNotEmpty()
  public type_id: number;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public desc: string;

  // @IsNotEmpty()
  // @IsNotEmptyObject()
  // public file: string;
}

/* -------------------------- Create Portfolio Type ------------------------- */
export class CreatePortfolioTypeDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public desc: string;

  @IsInt()
  @IsNotEmpty()
  public score: number;

  @IsString()
  @IsNotEmpty()
  public group: string;
}

export class DeletePortfolioTypeDto {
  @IsInt()
  @IsNotEmpty()
  public type_id: number;
}
