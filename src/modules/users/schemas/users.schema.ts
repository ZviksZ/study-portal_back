import { Prop, Schema, SchemaFactory }        from '@nestjs/mongoose';
import { ApiProperty }                        from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Post }                               from '../../posts/schemas/posts.schema';
import { MongoSchemaCommon }                  from '../../../common/mongo-schema-common';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User extends MongoSchemaCommon{
  @ApiProperty({ example: 'user@mail.ru', description: 'Почтовый адрес' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: 'user_user', description: 'Никнейм пользователя' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ example: 'ADMIN', description: 'Роль пользователя' })
  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  password: string;

  @ApiProperty({
    type: () => [Post],
    description: 'Посты пользователя',
    required: false,
  })
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Post' }],
  })
  posts: Post[] = [];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: function (_: any, obj: User) {
    delete obj.password;
    return obj;
  },
});
