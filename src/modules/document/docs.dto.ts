import { IsString, IsEmail, IsDecimal, IsOptional, IsNotEmpty, IsInt, IsNumberString } from 'class-validator';

export class CreateDocsDto {
  @IsNotEmpty()
  @IsNumberString()
  public apply_id: number;

  @IsNotEmpty()
  @IsString()
  public transcript: string;

  @IsNotEmpty()
  @IsString()
  public identity_card: string;

  @IsNotEmpty()
  @IsString()
  public student_card: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public name_change: string;
}

export class GetAllDocsDto {
  @IsNotEmpty()
  @IsNumberString()
  public docs_id: number;
}
