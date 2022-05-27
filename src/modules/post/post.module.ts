import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPost, UserPostSchema } from 'src/schemas/post.schema';
import { MediaModule } from '../media/media.module';
import { User, UserSchema } from 'src/schemas/user.schema';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserPost.name,
        schema: UserPostSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    MediaModule,
    WebsocketModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
