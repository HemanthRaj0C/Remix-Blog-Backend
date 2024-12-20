import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
