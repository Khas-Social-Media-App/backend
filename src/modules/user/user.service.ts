import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UpdateUserDto from 'src/dtos/update-user.dto';
import { ObjectId } from 'src/pipes/parse-object-id.pipe';
import { UserPost, UserPostDocument } from 'src/schemas/post.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(UserPost.name)
    private readonly userPostModel: Model<UserPostDocument>,
  ) {}

  async pushFollowers(userId: ObjectId, followedPersonId: ObjectId) {
    const user = await this.userModel.findById(followedPersonId);

    if (
      user.followers
        .map((id) => id.toString())
        .includes(followedPersonId.toString())
    ) {
      throw new BadRequestException('User already followed');
    }

    await user.updateOne({ $addToSet: { followers: userId } }).lean();
  }

  async followUser(followedPersonId: ObjectId, userId: ObjectId) {
    const myUser = await this.userModel.findById(userId);

    if (
      myUser.following
        .map((id) => id.toString())
        .includes(followedPersonId.toString())
    ) {
      throw new BadRequestException('User already followed');
    }

    if (userId.toString() === followedPersonId.toString()) {
      throw new BadRequestException('You can not follow yourself');
    }

    await myUser
      .updateOne({ $addToSet: { following: followedPersonId } }, { new: true })
      .lean();

    await this.pushFollowers(userId, followedPersonId);

    return myUser;
  }

  async unfollowUser(followedPersonId: ObjectId, userId: ObjectId) {
    const user = await this.userModel.findById(userId);

    if (
      !user.following
        .map((id) => id.toString())
        .includes(followedPersonId.toString())
    ) {
      throw new BadRequestException('User not followed');
    }

    await user
      .updateOne({ $pull: { following: followedPersonId } }, { new: true })
      .lean();

    const newUser = await this.userModel
      .findByIdAndUpdate(
        followedPersonId,
        { $pull: { followers: userId } },
        { new: true },
      )
      .lean();

    return newUser;
  }

  async getFollowingUsers(userId: ObjectId) {
    const user = await this.userModel.findById(userId).lean();

    const followingUsers = await this.userModel
      .find({
        _id: { $in: user.following },
      })
      .lean();

    return followingUsers;
  }

  async getSingleUser(userId: ObjectId) {
    const user = await this.userModel.findById(userId).lean();

    const userPosts = await this.userPostModel
      .find({
        owner: userId,
      })
      .populate('owner')
      .lean();

    return {
      userInfo: user,
      posts: userPosts,
    };
  }

  async searchUsers(text: string, page: number) {
    const regex = new RegExp(`^(${text.split(' ').join('|')})`, 'i');

    const users = await this.userModel
      .find({
        $or: [
          {
            displayName: regex,
          },

          {
            title: regex,
          },
          {
            username: regex,
          },
        ],
      })
      .skip(page * 15)
      .limit(15)
      .lean();

    return users;
  }

  updateUser(userId: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });
  }
}
