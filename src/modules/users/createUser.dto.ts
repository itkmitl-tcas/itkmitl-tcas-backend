import { IsString, IsEmail, IsNotEmpty, Min, Max, IsInt, Allow } from 'class-validator';

class CreateUserDto {
  @IsString()
  public apply_id: string;

  @IsString()
  public prefix: string;

  @IsString()
  public name: string;

  @IsString()
  public surname: string;

  @IsEmail()
  public email: string;

  @IsString()
  public mobile: string;

  @IsString()
  public school: string;

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

export default CreateUserDto;
