import { Controller, Post, Body } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from '../../dtos/create-post.dto';
import { UpdatePostDto } from '../../dtos/update-post.dto';
import { CurrentUser } from 'src/decorators/current-user';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create-post')
  createPost(@CurrentUser() currentUser, @Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
  }
}
