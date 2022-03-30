import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Post {
  @Prop({
    type: String,
    required: true,
  })
  content: string;

  @Prop({
    type: Array,
    default: [],
  })
  likes: Array<any>;

  @Prop({
    type: Array,
    default: [],
  })
  comments: Array<any>;

  @Prop({
    type: String,
  })
  image: string;
}

export type PostDocument = Post & Document;

const PostSchema = SchemaFactory.createForClass(Post);

export { PostSchema };
