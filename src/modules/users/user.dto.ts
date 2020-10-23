import { IsString, IsEmail, IsDecimal, IsOptional, IsNotEmpty, IsInt, IsNumberString } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  @IsNotEmpty()
  public apply_id: number;

  @IsString()
  @IsNotEmpty()
  public prename: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public surname: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public mobile: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public school_name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDecimal()
  public gpax: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDecimal()
  public gpax_match: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDecimal()
  public gpax_eng: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDecimal()
  public gpax_com: number;

  @IsOptional()
  @IsNotEmpty()
  @IsDecimal()
  public credit_total: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public study_field: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public apply_type: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  public permission: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  public step: string;
}

export class SignInDto {
  @IsInt()
  public apply_id: number;

  @IsString()
  public name: string;

  @IsString()
  public surname: string;
}

export class SignInTDto {
  @IsString()
  public apply_id: number;

  @IsString()
  public password: string;
}
