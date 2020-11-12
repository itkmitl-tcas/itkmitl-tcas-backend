import { IsString, IsEmail, IsDecimal, IsOptional, IsNotEmpty, IsInt, IsNumberString } from 'class-validator';
export class GetUserDto {
  @IsInt()
  @IsNotEmpty()
  public apply_id: number;
}
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
  @IsString()
  public school_name: string;

  @IsOptional()
  @IsDecimal()
  public gpax: number;

  @IsOptional()
  @IsDecimal()
  public gpax_match: number;

  @IsOptional()
  @IsDecimal()
  public gpax_eng: number;

  @IsOptional()
  @IsDecimal()
  public gpax_com: number;

  @IsOptional()
  @IsDecimal()
  public credit_total: number;

  @IsOptional()
  @IsString()
  public study_field: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public apply_type: string;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  public permission: string;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
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
  public email: string;

  @IsString()
  public password: string;
}
