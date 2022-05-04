import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

@Schema({
  timestamps: true,
})
export class Comment extends mongoose.Document {
  @Prop({
    required: true,
    type: String,
  })
  comment: string;

  @Prop({
    required: true,
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  })
  owner: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
