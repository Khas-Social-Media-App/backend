import { Injectable } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user';
import { CreatePostDto } from '../../dtos/create-post.dto';
import { UpdatePostDto } from '../../dtos/update-post.dto';

@Injectable()
export class PostService {
  createPost(createPostDto: CreatePostDto) {
    console.log(createPostDto);
  }
}
