import { IsString, IsUrl, Max, Min } from 'class-validator';

export class CreatePostDto {
  @Max(140)
  @Min(1)
  content: string;

  @IsString()
  @IsUrl()
  image?: string;
}
