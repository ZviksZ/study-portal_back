import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/users.schema';
import { MongoSchemaCommon } from '../../../common/mongo-schema-common';
import { Post } from '../../posts/schemas/posts.schema';

export type CommentDocument = Comment & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Comment extends MongoSchemaCommon {
  @ApiProperty({ example: 'Lorem ipsum', description: 'Текст комментария' })
  @Prop({ required: true })
  text: string;

  @ApiProperty({
    type: () => Post,
    description: 'Пост, к которому привязан комментарий',
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;

  @ApiProperty({ type: () => User, description: 'Автор комментария' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
