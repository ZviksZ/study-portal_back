import { forwardRef, Module } from '@nestjs/common';
import { PostsController }    from './posts.controller';
import { PostsService }       from './posts.service';
import { Post, PostSchema }   from './schemas/posts.schema';
import { MongooseModule }     from '@nestjs/mongoose';
import { User, UserSchema }   from '../users/schemas/users.schema';
import { AuthModule }         from '../auth/auth.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
})
export class PostsModule {}
