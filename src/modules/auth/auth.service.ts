import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/dtos/register.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from 'src/dtos/login.dto';

export interface AuthResult {
  user: Record<string, any>;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async register(registerDto: RegisterDto) {
    if (
      !registerDto.email ||
      !registerDto.password ||
      !registerDto.firstName ||
      registerDto.password.length < 6 ||
      !registerDto.lastName
    ) {
      throw new BadRequestException('Missing required fields');
    }

    const isExist = await this.userModel.findOne({ email: registerDto.email });

    if (isExist) {
      throw new BadRequestException('User already exist');
    }

    const hashed = await bcrypt.hash(registerDto.password, 10);

    const user = new this.userModel({
      email: registerDto.email,
      password: hashed,
      username: registerDto.username,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      favoriteLanguage: registerDto.favoriteLanguage,
    });

    await user.save();

    const payload = { email: user.email, _id: user._id };

    return {
      user: {
        ...user.toObject(),
        password: undefined,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Password is incorrect');
    }

    const payload = { email: user.email, _id: user._id };

    return {
      user: {
        ...user.toObject(),
        password: undefined,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}
