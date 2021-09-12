import {forwardRef, Module} from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Post, PostSchema} from "../posts/schemas/posts.schema";
import {AuthModule} from "../auth/auth.module";
import {Comment, CommentSchema} from "./schemas/comments.schema";

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    forwardRef(() => AuthModule),
  ],
})
export class CommentsModule {}
