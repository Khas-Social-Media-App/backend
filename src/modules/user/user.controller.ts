import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user';
import UpdateUserDto from 'src/dtos/update-user.dto';
import { ObjectId, ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('follow-user/:followedPersonId')
  followUser(
    @Param('followedPersonId', new ParseObjectIdPipe())
    followedPersonId: ObjectId,
    @CurrentUser() currentUser,
  ) {
    return this.userService.followUser(followedPersonId, currentUser._id);
  }

  @Put('unfollow-user/:followedPersonId')
  unfollowUser(
    @Param('followedPersonId', new ParseObjectIdPipe())
    followedPersonId: ObjectId,
    @CurrentUser() currentUser,
  ) {
    return this.userService.unfollowUser(followedPersonId, currentUser._id);
  }

  @Get('get-following-users')
  getFollowingUsers(@CurrentUser() currentUser) {
    return this.userService.getFollowingUsers(currentUser._id);
  }

  @Get('single-user/:userId')
  getSingleUser(@Param('userId', new ParseObjectIdPipe()) userId: ObjectId) {
    return this.userService.getSingleUser(userId);
  }

  @Get('search-user')
  searchUser(
    @Query('text') text: string,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.userService.searchUsers(text, page);
  }

  @Put('update-user')
  updateUser(@CurrentUser() currentUser, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(currentUser._id, updateUserDto);
  }
}
