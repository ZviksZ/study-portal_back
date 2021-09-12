import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Post, PostDocument} from "../posts/schemas/posts.schema";
import {Model} from "mongoose";
import {User, UserDocument} from "../users/schemas/users.schema";
import {CreatePostDto} from "../posts/dto/create-post.dto";
import {UpdatePostDto} from "../posts/dto/update-post.dto";
import {Comment, CommentDocument} from "./schemas/comments.schema";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {UpdateCommentDto} from "./dto/update-comment.dto";
const ObjectId = require('mongodb').ObjectID;

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private commentsModel: Model<CommentDocument>,
        @InjectModel(Post.name) private postsModel: Model<PostDocument>,
    ) {}

    async getPostComments(postId?: string | undefined): Promise<Comment[]> {
        try {
            return await this.commentsModel
                .find(postId ? { post: ObjectId(postId) } : {})
                .populate({ path: 'author', select: 'username email' })
                .exec();
        } catch (e) {
            throw new HttpException('Comments no found', HttpStatus.NOT_FOUND);
        }
    }

    async getComment(id: string): Promise<Comment> {
        try {
            return await this.commentsModel
                .findById(id)
                .populate({ path: 'author', select: 'username email' })
                .exec();
        } catch (e) {
            throw new HttpException('Comment no found', HttpStatus.NOT_FOUND);
        }
    }

    async createComment(
        commentDto: CreateCommentDto,
        userId: string,
    ): Promise<Comment | undefined> {
        try {
            if (userId) {
                const comment = await this.commentsModel.create({
                    ...commentDto,
                    author: ObjectId(userId),
                });

                await this.postsModel.findByIdAndUpdate(ObjectId(commentDto.post), {
                    $push: { comments: comment._id },
                });

                return await comment
                    .populate({ path: 'author', select: 'username email' })
                    .execPopulate();
            }
        } catch (e) {
            throw new HttpException('Add comment error', HttpStatus.NOT_FOUND);
        }
    }

    async removeComment(commentId: string, userId: string): Promise<Comment> {
        try {
            const comment = await this.commentsModel
                .findById(commentId)
                .populate('author')
                .exec();
            await comment.remove();

            await this.postsModel.findByIdAndUpdate(comment.post, {
                $pull: { comments: comment._id },
            });

            return comment;
        } catch (e) {
            throw new HttpException('Remove comment error', HttpStatus.NOT_FOUND);
        }
    }

    async updateComment(commentId: string, commentDto: UpdateCommentDto): Promise<Comment> {
        try {
            const comment = await this.commentsModel
                .findById(commentId)
                .populate('author')
                .exec();

            await comment.update({ ...commentDto });

            return comment;
        } catch (e) {
            throw new HttpException('Update comment error', HttpStatus.NOT_FOUND);
        }
    }
}
