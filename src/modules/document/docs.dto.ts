import { IsString, IsOptional, IsNotEmpty, IsInt, IsNumberString } from 'class-validator';

export class CreateDocsDto {
  public transcript: File;
  public identity_card: File;
  public student_card: File;

  @IsOptional()
  public name_change: File;
}

export class GetAllDocsDto {
  @IsNotEmpty()
  @IsNumberString()
  public docs_id: number;
}
