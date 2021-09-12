import { Prop, Schema, SchemaFactory }                  from '@nestjs/mongoose';
import { ApiProperty }                                  from '@nestjs/swagger';
import { Document, ObjectId, Schema as MongooseSchema } from 'mongoose';
import { User }                                         from '../../users/schemas/users.schema';
import { MongoSchemaCommon }                            from '../../../common/mongo-schema-common';

export type PostDocument = Post & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Post extends MongoSchemaCommon {
  @ApiProperty({ example: 'Post 1', description: 'Заголовок поста' })
  @Prop({ required: true, unique: true })
  title: string;

  @ApiProperty({ example: 'lorem ipsum lorem', description: 'Текст поста' })
  @Prop({ required: true })
  body: string;

  @ApiProperty({ type: () => User, description: 'Автор поста' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: User;

  @ApiProperty({
    type: [String],
    description: 'Комментарии поста',
    required: false,
  })
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Comment' }],
  })
  comments: Comment[] = [];
}

export const PostSchema = SchemaFactory.createForClass(Post);
