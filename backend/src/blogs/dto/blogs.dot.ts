import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;
}
