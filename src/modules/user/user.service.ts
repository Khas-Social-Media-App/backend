import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'src/pipes/parse-object-id.pipe';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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
    const user = await this.userModel.findById(userId);

    if (
      user.following
        .map((id) => id.toString())
        .includes(followedPersonId.toString())
    ) {
      throw new BadRequestException('User already followed');
    }

    if (userId.toString() === followedPersonId.toString()) {
      throw new BadRequestException('You can not follow yourself');
    }

    await user
      .updateOne({ $addToSet: { following: followedPersonId } }, { new: true })
      .lean();

    await this.pushFollowers(userId, followedPersonId);

    return user;
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

    await this.userModel
      .findByIdAndUpdate(
        followedPersonId,
        { $pull: { followers: userId } },
        { new: true },
      )
      .lean();

    return user;
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
}
