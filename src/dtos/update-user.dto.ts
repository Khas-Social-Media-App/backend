import { IsEmail, IsOptional, IsString } from 'class-validator';

class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  title: string;
}

export default UpdateUserDto;
