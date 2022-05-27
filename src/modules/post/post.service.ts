import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'src/pipes/parse-object-id.pipe';
import { UserPost, UserPostDocument } from 'src/schemas/post.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreatePostDto } from '../../dtos/create-post.dto';
import { UpdatePostDto } from '../../dtos/update-post.dto';
import { MediaService } from '../media/media.service';
import { AppGateway } from '../websocket/websocket.gateway';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(UserPost.name)
    private readonly userPostModel: Model<UserPostDocument>,
    private readonly websocketGateway: AppGateway,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly media: MediaService,
  ) {}

  getAllPosts() {
    return this.userPostModel.find().populate('owner').sort({ createdAt: -1 });
  }

  getUsersAllPosts(userId: ObjectId) {
    return this.userPostModel
      .find({
        owner: userId,
      })
      .populate('owner')
      .sort({ createdAt: -1 })
      .lean();
  }

  getUsersAllPostsCount(userId: ObjectId) {
    return this.userPostModel.find({ owner: userId }).countDocuments();
  }

  async getFollowingUsersPosts(userId: ObjectId) {
    const currentUser = await this.userModel.findById(userId).lean();

    const following = currentUser.following;

    following.push(currentUser._id);

    const findPostFollowingUsers = await this.userPostModel
      .find({
        owner: {
          $in: following,
        },
      })
      .populate('owner')
      .sort({ createdAt: -1 });

    return findPostFollowingUsers;
  }

  async createPost(userId: ObjectId, createPostDto: CreatePostDto) {
    let postCreate = await this.userPostModel.create({
      ...createPostDto,
      owner: userId,
    });

    postCreate = await postCreate.populate('owner');

    const user = await this.userModel.findById(userId).lean();

    const followers = user.followers;

    followers.forEach(async (follower) => {
      this.websocketGateway.server
        .to(`user_room:${follower}`)
        .emit('POST', { post: postCreate });
    });

    return postCreate;
  }

  updatePost(userId: ObjectId, postId: ObjectId, updatePostDto: UpdatePostDto) {
    return this.userPostModel
      .findOneAndUpdate(
        {
          _id: postId,
          owner: userId,
        },
        updatePostDto,
        { new: true },
      )
      .lean();
  }

  async deletePost(userId: ObjectId, postId: ObjectId) {
    const deletePost = await this.userPostModel
      .findOneAndDelete({
        _id: postId,
        owner: userId,
      })
      .lean();

    return deletePost;
  }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.media.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  likePost(userId: ObjectId, postId: ObjectId) {
    return this.userPostModel
      .findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $addToSet: {
            likes: userId,
          },
        },
        { new: true },
      )
      .lean();
  }

  unlikePost(userId: ObjectId, postId: ObjectId) {
    return this.userPostModel
      .findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $pull: {
            likes: userId,
          },
        },
        { new: true },
      )
      .lean();
  }

  async addComment(userId: ObjectId, postId: ObjectId, comment: string) {
    const post = await this.userPostModel
      .findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $addToSet: {
            comments: {
              owner: userId,
              comment: comment,
            },
          },
        },
        { new: true },
      )
      .lean();

    post.comments = post.comments.reverse();

    return post;
  }

  removeComment(userId: ObjectId, postId: ObjectId, commentId: ObjectId) {
    return this.userPostModel
      .findOneAndUpdate(
        {
          _id: postId,
        },
        {
          $pull: {
            comments: {
              _id: commentId,
              owner: userId,
            },
          },
        },
        { new: true },
      )
      .lean();
  }
}
