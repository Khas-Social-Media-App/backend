import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): { message: string } {
    return {
      message: 'Welcome To The Khas Social Media API !',
    };
  }
}
