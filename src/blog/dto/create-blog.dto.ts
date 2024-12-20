import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  shortDescription: string;

  @IsString()
  content: string;

}
