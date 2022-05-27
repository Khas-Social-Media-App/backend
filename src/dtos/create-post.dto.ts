import {
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(280)
  @MinLength(1)
  content: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  image?: string;
}
