// eslint-disable-next-line max-classes-per-file
import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsNumber()
  githubId: string;

  @IsString()
  @IsOptional()
  displayName: string;

  @IsString()
  photoURL: string;
}
