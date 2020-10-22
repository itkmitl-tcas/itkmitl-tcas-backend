import { IsString, IsEmail, IsDecimal, IsOptional, IsNotEmpty, IsInt, IsNumberString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public apply_id: string;

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
  public gpax: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDecimal()
  public gpax_match: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDecimal()
  public gpax_eng: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDecimal()
  public gpax_com: string;

  @IsOptional()
  @IsNotEmpty()
  @IsDecimal()
  public credit_total: string;

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
  @IsString()
  public apply_id: string;

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
