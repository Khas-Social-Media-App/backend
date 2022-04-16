import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Comment, CommentSchema } from './comment.schema';
import { User } from './user.schema';

@Schema({
  timestamps: true,
})
export class UserPost {
  @Prop({
    type: String,
    required: true,
  })
  content: string;

  @Prop({
    type: Array,
    ref: 'User',
    default: [],
  })
  likes: Array<User>;

  @Prop({
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  owner: User;

  @Prop({
    type: [CommentSchema],
    default: [],
  })
  comments: mongoose.Types.Array<Comment>;

  @Prop({
    type: String,
  })
  image: string;
}

export type UserPostDocument = UserPost & Document;

const UserPostSchema = SchemaFactory.createForClass(UserPost);

export { UserPostSchema };
