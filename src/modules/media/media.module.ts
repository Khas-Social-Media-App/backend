import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaProvider } from './media.provider';

@Module({
  providers: [MediaProvider, MediaService],
  exports: [MediaProvider, MediaService],
})
export class MediaModule {}
