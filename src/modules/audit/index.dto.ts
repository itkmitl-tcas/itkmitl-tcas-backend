import { IsNotEmpty, IsOptional, IsNumberString, IsString } from 'class-validator';

export class MappingDto {
  @IsString()
  @IsNotEmpty()
  public student_id: string;

  @IsNumberString()
  @IsNotEmpty()
  public teacher_id: string;
}

export class GetMappingDto {
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  public teacher_id: string;
}
