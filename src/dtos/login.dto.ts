// eslint-disable-next-line max-classes-per-file
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  githubToken: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  displayName: string;

  @IsString()
  photoURL: string;

  @IsString()
  githubUid: string;
}
