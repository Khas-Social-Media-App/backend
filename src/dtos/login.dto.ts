// eslint-disable-next-line max-classes-per-file
import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  githubToken: string;

  @IsString()
  displayName: string;

  @IsString()
  photoURL: string;

  @IsString()
  githubUid: string;
}
