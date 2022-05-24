import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Param,
  Delete,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from '../../dtos/create-post.dto';
import { UpdatePostDto } from '../../dtos/update-post.dto';
import { CurrentUser } from 'src/decorators/current-user';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ObjectId, ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommentDto } from 'src/dtos/add-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('all-posts')
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get('get-users-all-posts')
  getUsersAllPosts(@CurrentUser() currentUser) {
    return this.postService.getUsersAllPosts(currentUser._id);
  }

  @Get('get-users-all-posts-count')
  getUsersAllPostsCount(@CurrentUser() currentUser) {
    return this.postService.getUsersAllPostsCount(currentUser._id);
  }

  @Get('get-following-users-posts')
  getFollowingUsersPosts(@CurrentUser() currentUser) {
    return this.postService.getFollowingUsersPosts(currentUser._id);
  }
  @Post('create-post')
  createPost(@CurrentUser() currentUser, @Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(currentUser._id, createPostDto);
  }

  @Put('update-post/:postId')
  updatePost(
    @Param('postId', new ParseObjectIdPipe()) postId: ObjectId,
    @CurrentUser() currentUser,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(currentUser._id, postId, updatePostDto);
  }

  @Delete('delete-post/:postId')
  deletePost(
    @Param('postId', new ParseObjectIdPipe()) postId: ObjectId,
    @CurrentUser() currentUser,
  ) {
    return this.postService.deletePost(currentUser._id, postId);
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImageToCloudinary(@UploadedFile() file) {
    console.log('image', file);
    return this.postService.uploadImageToCloudinary(file);
  }

  @Put('like-post/:postId')
  likePost(
    @Param('postId', new ParseObjectIdPipe()) postId: ObjectId,
    @CurrentUser() currentUser,
  ) {
    return this.postService.likePost(currentUser._id, postId);
  }

  @Put('unlike-post/:postId')
  unlikePost(
    @Param('postId', new ParseObjectIdPipe()) postId: ObjectId,
    @CurrentUser() currentUser,
  ) {
    return this.postService.unlikePost(currentUser._id, postId);
  }

  @Post('add-comment/:postId')
  addComment(
    @Param('postId', new ParseObjectIdPipe()) postId: ObjectId,
    @CurrentUser() currentUser,
    @Body() commentDto: CommentDto,
  ) {
    return this.postService.addComment(
      currentUser._id,
      postId,
      commentDto.comment,
    );
  }

  @Put('remove-comment/:postId/:commentId')
  removeComment(
    @Param('postId', new ParseObjectIdPipe()) postId: ObjectId,
    @Param('commentId', new ParseObjectIdPipe()) commentId: ObjectId,
    @CurrentUser() currentUser,
  ) {
    return this.postService.removeComment(currentUser._id, postId, commentId);
  }
}
