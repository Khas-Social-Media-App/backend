import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user';
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
}
