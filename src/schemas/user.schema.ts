import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    unique: true,
  })
  githubId: string;

  @Prop({
    type: String,
  })
  displayName: string;

  @Prop({
    type: String,
    unique: true,
  })
  username: string;

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
  photoURL: string;

  @Prop({
    type: String,
  })
  title: string;

  @Prop({
    enum: [
      'JavaScript',
      'TypeScript',
      'Java',
      'C#',
      'C++',
      'Python',
      'Ruby',
      'PHP',
      'Go',
      'Rust',
      'Swift',
      'Kotlin',
      'C',
      'Objective-C',
      'Other',
    ],
  })
  favoriteLanguage: favoriteLanguageEnum;
}

export enum favoriteLanguageEnum {
  JavaScript = 'JavaScript',
  TypeScript = 'TypeScript',
  CSharp = 'CSharp',
  Java = 'Java',
  Python = 'Python',
  Ruby = 'Ruby',
  Go = 'Go',
  Kotlin = 'Kotlin',
  Swift = 'Swift',
  C = 'C',
  CPlusPlus = 'CPlusPlus',
  CPlusPlusPlus = 'CPlusPlusPlus',
  ObjectiveC = 'ObjectiveC',
  PHP = 'PHP',
  HTML = 'HTML',
  CSS = 'CSS',
  SQL = 'SQL',
  R = 'R',
  Bash = 'Bash',
  Lua = 'Lua',
  Perl = 'Perl',
  Scala = 'Scala',
  Erlang = 'Erlang',
  Other = 'Other',
}

export type UserDocument = User & Document;

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
