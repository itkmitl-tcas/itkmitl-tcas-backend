import { IsString, IsEmail, IsNotEmpty, Min, Max, IsInt, Allow, isString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public apply_id: string;

  @IsString()
  public prename: string;

  @IsString()
  public name: string;

  @IsString()
  public surname: string;

  @IsEmail()
  public email: string;

  @IsString()
  public mobile: string;

  @IsString()
  public school_name: string;

  // @Allow()
  // @IsInt()
  // @Min(0)
  // @Max(4)
  // public gpax: string;

  // @Allow()
  // @IsInt()
  // @Min(0)
  // @Max(4)
  // public gpax_match: string;

  // @Allow()
  // @IsInt()
  // @Min(0)
  // @Max(4)
  // public gpax_eng: string;

  // @Allow()
  // @IsInt()
  // @Min(0)
  // @Max(4)
  // public gpax_com: string;

  // @IsInt()
  // @Allow()
  // public credit_total: string;

  // @IsString()
  // public study_field: string;

  // @Allow()
  // @IsString()
  // public apply_type: string;
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
  public apply_id: string;

  @IsString()
  public password: string;
}
