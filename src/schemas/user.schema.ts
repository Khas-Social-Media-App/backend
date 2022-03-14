import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: String,
  })
  username: string;

  @Prop({
    type: String,
  })
  phone: string;

  @Prop({
    type: Array,
    default: [],
  })
  followers: Array<string>;

  @Prop({
    type: Array,
    default: [],
  })
  following: Array<string>;

  @Prop({
    type: String,
  })
  profilePicture: string;
}

export type UserDocument = User & Document;

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
